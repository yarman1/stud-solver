import { Module } from '@nestjs/common';
import { MathService } from './math.service';
import { MathController } from './math.controller';
import {PrismaModule} from "../prisma/prisma.module";
import {MathDbService} from "./math-db.service";
import {FileHandlerService} from "../file-handler/file-handler.service";
import {FileHandlerModule} from "../file-handler/file-handler.module";
import {JwtModule} from "@nestjs/jwt";

@Module({
  providers: [MathService, MathDbService],
  controllers: [MathController],
  imports: [PrismaModule, FileHandlerModule, JwtModule]
})
export class MathModule {}
