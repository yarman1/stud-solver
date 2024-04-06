import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import {APP_GUARD} from "@nestjs/core";
import {AtGuard} from "./common/guards/at.guard";
import { MathModule } from './math/math.module';
import { FileHandlerModule } from './file-handler/file-handler.module';
import { HistoryModule } from './history/history.module';
import { ResourcesModule } from './resources/resources.module';
import { TaskModule } from './task/task.module';
import {ScheduleModule} from "@nestjs/schedule";
import {TaskService} from "./task/task.service";
import {ThrottlerModule} from "@nestjs/throttler";
import {ThrottlerStorageRedisService} from "nestjs-throttler-storage-redis";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      ttl: 7 * 24 * 60 * 60 * 1000,
      url: `${process.env.REDIS_URL}`,
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    MathModule,
    FileHandlerModule,
    HistoryModule,
    ResourcesModule,
    TaskModule,
    ThrottlerModule.forRoot({
      throttlers: [{
      name: 'short',
      ttl: 60,
      limit: 10,
    },
      {
        name: 'medium',
        ttl: 60,
        limit: 10,
      }
    ],
    storage: new ThrottlerStorageRedisService(process.env.REDIS_URL)})
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    TaskService
  ],
})
export class AppModule {}
