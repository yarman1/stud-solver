import {BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {promisify} from 'util';
import {randomBytes, scrypt as _scrypt} from 'crypto';
import {UsersService} from "../users/users.service";
import {JwtService} from "@nestjs/jwt";
import {AuthSigninDto} from "./dto/auth.signin.dto";
import {AuthSignupDto} from "./dto/auth.signup.dto";
import {JwtPayload} from "./types/jwtPayload.type";
import {ConfigService} from "@nestjs/config";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from 'cache-manager';
import {v4 as uuid} from 'uuid';
import {Tokens} from "./types/tokens.type";


const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    async signup(dto: AuthSignupDto) {
        const user = await this.usersService.findOneByEmail(dto.email);
        if (user) {
            throw new BadRequestException('email is in use');
        }

        const hashedPassword = await this.hashData(dto.password);

        return await this.usersService.create(dto.email, hashedPassword, dto.userName);
    }
    async signin(dto: AuthSigninDto) {
        const user = await this.usersService.findOneByEmail(dto.email);
        if (!user) {
            throw new NotFoundException('user not found');
        }

        const isPasswordValid = await this.validatePassword(user.password_hash, dto.password);
        if (!isPasswordValid) {
            throw new BadRequestException('bad password');
        }
        return await this.getTokens(user.user_id, user.email);
    }

    async logout(user_id: string, deviceId: string) {
        await this.cacheManager.del(user_id + ';dev-id=' + deviceId);
        return true;
    }

    private async setRefreshTokenHash(rt: string, user_id: string, deviceId: string) {
        const salt = randomBytes(16).toString('hex');
        const hash = (await scrypt(rt, salt, 64)) as Buffer;
        const result = hash.toString('hex') + ';salt=' + salt;
        await this.cacheManager.set(user_id + ';dev-id=' + deviceId, result);
    }

    async getTokens(user_id: string, email: string, deviceId?: string | undefined): Promise<Tokens> {
        const jwtPayload: JwtPayload = {
            sub: user_id,
            email: email,
        };

        const [at, rt] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('JWT_SECRET_AT'),
                expiresIn: '15m',
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.config.get<string>('JWT_SECRET_RT'),
                expiresIn: '7d',
            }),
        ]);

        if (!deviceId) {
            deviceId = uuid();
        }
        await this.setRefreshTokenHash(rt, user_id, deviceId);

        return {
            access_token: at,
            refresh_token: rt,
            device_id: deviceId,
        };
    }

    async refresh(user_id: string, rt: string, deviceId: string): Promise<Tokens> {
        const user = await this.usersService.findOneById(user_id);

        const hashedRt: string = await this.cacheManager.get(user_id + ';dev-id=' + deviceId);
        if (!user || !hashedRt) throw new ForbiddenException('Access Denied');

        const [storedHash, salt] = hashedRt.split(';salt=');

        const hash = (await scrypt(rt, salt, 64)) as Buffer;
        if (storedHash !== hash.toString('hex')) {
            throw new ForbiddenException('Access Denied');
        }

        return await this.getTokens(user_id, user.email, deviceId);
    }

    async deleteUser(user_id: string) {
        await this.usersService.remove(user_id);
        const cacheKeys = await this.cacheManager.store.keys(user_id + '*');
        for (const key of cacheKeys) {
            await this.cacheManager.del(key);
        }
        return {
            message: 'User deleted successfully'
        }
    }

    async updateUserName(user_id: string, newUserName: string) {
        await this.usersService.updateUserName(user_id, newUserName);
        return {
            userName: newUserName,
        }
    }

    async getUserName(user_id: string) {
        const userName = await this.usersService.findOneById(user_id);
        return {
            userName
        };
    }

    async updatePassword(oldPassword: string, newPassword: string, user_id: string) {
        const user = await this.usersService.findOneById(user_id);

        const isPasswordValid = await this.validatePassword(user.password_hash, oldPassword);
        if (!isPasswordValid) {
            throw new ForbiddenException('False password');
        }

        const cacheKeys = await this.cacheManager.store.keys(user_id + '*');
        for (const key of cacheKeys) {
            await this.cacheManager.del(key);
        }

        const newHashedPassword = await this.hashData(newPassword);
        await this.usersService.updatePassword(user_id, newHashedPassword);
        const newTokens = await this.getTokens(user_id, user.email);

        return {
            message: 'Password updated successfully',
            newTokens,
        }
    }

    private async validatePassword(passwordHash: string, password: string) {
        const [storedHash, salt] = passwordHash.split(';salt=');
        const hash = (await scrypt(password, salt, 64)) as Buffer;
        return storedHash === hash.toString('hex');

    }

    private async hashData(dataToHash: string) {
        const salt = randomBytes(16).toString('hex');
        const hash = (await scrypt(dataToHash, salt, 64)) as Buffer;
        return hash.toString('hex') + ';salt=' + salt;
    }

}
