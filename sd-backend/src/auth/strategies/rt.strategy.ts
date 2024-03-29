import {ForbiddenException, Injectable, NotFoundException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import { Request } from 'Express';
import {JwtPayload} from "../types/jwtPayload.type";
import {JwtPayloadRt} from "../types/jwtPayloadRt.type";
import {UsersService} from "../../users/users.service";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService, private usersService: UsersService) {
        super({
            jwtFromRequest: (req: Request) => {
                let token: string = null;
                console.log(req.cookies)
                if (req && req.cookies) {
                    token = req.cookies['refreshToken'];
                    console.log(token)
                }
                return token;
            },
            secretOrKey: config.get<string>('JWT_SECRET_RT'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken: string = req.cookies['refreshToken'];
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');
        const isExist = await this.usersService.isExist(payload.sub);
        if (!isExist) {
            throw new NotFoundException('User is deleted');
        }

        const deviceId: string = req.cookies['deviceId'];
        if (!deviceId) throw new ForbiddenException('Device id malformed');
        return {
            ...payload,
            refreshToken,
            deviceId,
        }
    }
}
