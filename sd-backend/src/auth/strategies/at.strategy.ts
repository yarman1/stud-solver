import {Injectable, NotFoundException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {ConfigService} from "@nestjs/config";
import {JwtPayload} from "../types/jwtPayload.type";
import {UsersService} from "../../users/users.service";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(config: ConfigService, private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get<string>('JWT_SECRET_AT'),
        });
    }

    async validate(payload: JwtPayload) {
        const isExist = await this.usersService.isExist(payload.sub);
        if (!isExist) {
            throw new NotFoundException('User is deleted');
        }
        return payload;
    }
}
