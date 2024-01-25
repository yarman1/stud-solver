import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  providers: [TaskService],
  imports: [PrismaModule]
})
export class TaskModule {}
