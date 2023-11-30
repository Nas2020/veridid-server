import { Test, TestingModule } from '@nestjs/testing';
import { VeramoService } from './veramo.service';

describe('VeramoService', () => {
  let service: VeramoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VeramoService],
    }).compile();

    service = module.get<VeramoService>(VeramoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
