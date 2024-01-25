import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {Cron} from "@nestjs/schedule";

@Injectable()
export class TaskService {
    constructor(private prismaService: PrismaService) {}

    @Cron('0 0 * * *')
    async handleCron() {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const deleteResult = await this.prismaService.solution.deleteMany({
            where: {
                live_to: {
                    gte: todayStart,
                    lte: todayEnd,
                },
            },
        });

        console.log(`Deleted ${deleteResult.count} solution records.`);
    }
}
