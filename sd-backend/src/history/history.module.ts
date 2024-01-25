import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import {FileHandlerModule} from "../file-handler/file-handler.module";
import {PrismaModule} from "../prisma/prisma.module";
import {UsersModule} from "../users/users.module";

@Module({
  controllers: [HistoryController],
  providers: [HistoryService],
  imports: [FileHandlerModule, PrismaModule, UsersModule]
})
export class HistoryModule {}
