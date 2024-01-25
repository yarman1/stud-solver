import { Test, TestingModule } from '@nestjs/testing';
import { FileHandlerService } from './file-handler.service';

describe('FileHandlerService', () => {
  let service: FileHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileHandlerService],
    }).compile();

    service = module.get<FileHandlerService>(FileHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
