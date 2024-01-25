import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                request.user = this.jwtService.verify(token);
                return true;
            } catch (e) {
                console.log('Token verification failed:', e.message);
            }
        }

        return true;
    }
}
