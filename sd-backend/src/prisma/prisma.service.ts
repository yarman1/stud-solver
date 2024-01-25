import {INestApplication, Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import {ConfigService} from "@nestjs/config";
import * as process from "process";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, OnModuleDestroy {
    constructor(config: ConfigService) {
        const url = config.get<string>('DATABASE_URL')
        super({
            datasources: {
                db: {
                    url,
                },
            },
        });
    }
    async onModuleInit() {
        await this.$connect();
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    async cleanDatabase() {
        if (process.env.NODE_ENV === 'production') return;

        return Promise.all([this.user.deleteMany()]);
    }
}
