import {
    BadRequestException,
    ForbiddenException,
    HttpException, HttpStatus,
    Inject,
    Injectable,
    NotFoundException
} from '@nestjs/common';
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
import * as nodemailer from 'nodemailer';
import {Tokens} from "./types/tokens.type";
import {RequestRecoveryDto} from "./dto/request-recovery.dto";
import {RecoveryDto} from "./dto/recovery.dto";
import {ThrottlerException} from "@nestjs/throttler";
import {InjectQueue} from "@nestjs/bull";
import {Queue} from "bull";
import {Response} from "Express";
import {ResetDto} from "./dto/reset.dto";

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private config: ConfigService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @InjectQueue('recovery-queue') private recoveryQueue: Queue
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
        const isExist = await this.usersService.isExistUserName(newUserName);
        if (isExist) {
            throw new ForbiddenException('This username is already exist');
        }
        await this.usersService.updateUserName(user_id, newUserName);
        return {
            userName: newUserName,
        }
    }

    async getUserName(user_id: string) {
        const userName = (await this.usersService.findOneById(user_id)).user_name;
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

        if (oldPassword == newPassword) {
            throw new BadRequestException('New password should be different from old');
        }

        await this.changePassword(newPassword, user_id);

        const newTokens = await this.getTokens(user_id, user.email);

        return {
            message: 'Password updated successfully',
            newTokens,
        }
    }

    private async changePassword(password: string, userId: string) {
        const cacheKeys = await this.cacheManager.store.keys(userId + '*');
        for (const key of cacheKeys) {
            await this.cacheManager.del(key);
        }

        const newHashedPassword = await this.hashData(password);
        await this.usersService.updatePassword(userId, newHashedPassword);
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

    public async requestRecovery(dto: RequestRecoveryDto, res: Response) {
        const { email } = dto;
        const user = await this.usersService.findOneByEmail(email);
        if (!user) {
            throw new NotFoundException('There is no account with such email');
        }
        try {
            const job = await this.recoveryQueue.add({ email }, {
                removeOnFail: true,
            });
            const result = await job.finished();
            const token = uuid();
            await this.cacheManager.set(token, email, 15 * 60 * 1000);
            await this.sendRecoverEmail(email, token);
            res.status(HttpStatus.OK).json({
                statusCode: HttpStatus.OK,
                message: 'Recover email has been sent',
            });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.TOO_MANY_REQUESTS).json({
                statusCode: HttpStatus.TOO_MANY_REQUESTS,
                message: 'Suspicious activity has been detected. Please try again later',
            });
        }
    }

    private async sendRecoverEmail(email: string, token: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.config.get<string>('EMAIL_USERNAME'),
                pass: this.config.get<string>('EMAIL_PASSWORD'),
            }
        });

        const resetLink = this.config.get<string>('API_URL') + `/auth/reset-password?token=${token}`;

        await transporter.sendMail({
            from: '"StudSolver administration" <studsolver@gmail.com>',
            to: email,
            subject: 'Password reset request',
            html: `
            <p>Please click on the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>
            <p>If you did not request a password reset, please ignore this message. It's possible that another user entered your email address by mistake. No changes have been made to your account.</p>
            `
        });
    }

    public async getResetPage(dto: RecoveryDto, res: Response) {
        const { token } = dto;

        res.redirect(this.config.get<string>('CLIENT_URL') + `?token=${token}`);
    }

    public async resetPassword(dto: ResetDto, res: Response) {
        const { token, newPassword } = dto;

        const email = await this.cacheManager.get<string>(token);
        if (!email) {
            throw new NotFoundException('Time is up. Please try again')
        }

        const user = await this.usersService.findOneByEmail(email);
        const isDifferentPassword = ! (await this.validatePassword(user.password_hash, newPassword));
        if (!isDifferentPassword) {
            throw new BadRequestException('New password should be different from old');
        }

        await this.changePassword(newPassword, user.user_id);
        await this.cacheManager.del(token);

        res.status(HttpStatus.OK).json({
            message: 'Password updated successfully'
        });
    }
}
