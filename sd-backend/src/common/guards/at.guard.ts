import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Reflector} from "@nestjs/core";
import {Observable} from "rxjs";

@Injectable()
export class AtGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers.authorization;

        if (authorizationHeader) {
            return super.canActivate(context);
        } else {
            const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
                context.getHandler(),
                context.getClass(),
            ]);

            if (isPublic) {
                return true;
            }

            return super.canActivate(context);
        }
    }
}