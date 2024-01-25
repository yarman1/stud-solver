import { Module } from '@nestjs/common';
import { FileHandlerService } from './file-handler.service';

@Module({
  providers: [FileHandlerService],
  exports: [FileHandlerService]
})
export class FileHandlerModule {}
