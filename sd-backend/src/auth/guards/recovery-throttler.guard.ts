import {ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {ThrottlerGuard, ThrottlerStorage, ThrottlerModuleOptions, ThrottlerException} from "@nestjs/throttler";

@Injectable()
export class RecoveryThrottlerGuard extends ThrottlerGuard {
    protected errorMessage = 'Too many requests. Please try again later.';
}
