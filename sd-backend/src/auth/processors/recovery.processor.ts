import {Process, Processor} from "@nestjs/bull";
import {Job} from "bull";
import {RequestRecoveryDto} from "../dto/request-recovery.dto";
import {HttpException, HttpStatus, Inject} from "@nestjs/common";
import {CACHE_MANAGER} from "@nestjs/cache-manager";
import {Cache} from "cache-manager";


@Processor('recovery-queue')
export class RecoveryProcessor {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    @Process()
    async processRecoveryJob(job: Job<RequestRecoveryDto>) {
        const { email } = job.data;
        let counter = await this.cacheManager.get<number>(email + ';recovery-request-counter');
        if (!counter) {
            await this.cacheManager.set(email + ';recovery-request-counter', 1, 60 * 60 * 1000);
        } else {
            if (counter <= 500000) {
                const ttl = await this.cacheManager.store.ttl(email + ';recovery-request-counter');
                counter++;
                await this.cacheManager.set(email + ';recovery-request-counter', counter, ttl);
            } else {
                await this.cacheManager.del(email + ';recovery-request-counter');
                await this.cacheManager.set(email + ';blocked-recovery', true, 3 * 60 * 60 * 1000);
                throw new HttpException('Suspicious activity has been detected. Please try again later', HttpStatus.TOO_MANY_REQUESTS);
            }
        }
        return;
    }
}
