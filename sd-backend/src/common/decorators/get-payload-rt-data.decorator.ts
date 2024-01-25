import {createParamDecorator, ExecutionContext} from "@nestjs/common";
import {JwtPayloadRt} from "../../auth/types/jwtPayloadRt.type";

export const GetPayloadRtData = createParamDecorator(
    (data: keyof JwtPayloadRt | undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        if (!data) return request.user;
        return request.user[data];
    }
);
