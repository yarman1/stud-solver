import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import {PrismaModule} from "../prisma/prisma.module";

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
  imports: [PrismaModule]
})
export class ResourcesModule {}
