import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {AtStrategy} from "./strategies/at.strategy";
import {RtStrategy} from "./strategies/rt.strategy";
import {BullModule} from "@nestjs/bull";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
  imports : [
      PrismaModule,
      UsersModule,
      JwtModule.register({}),
      BullModule.registerQueue({
        name: 'recovery-queue',
      })
  ]
})
export class AuthModule {}
