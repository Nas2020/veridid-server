import { Test, TestingModule } from '@nestjs/testing';
import { VeramoController } from './veramo.controller';

describe('VeramoController', () => {
  let controller: VeramoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VeramoController],
    }).compile();

    controller = module.get<VeramoController>(VeramoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
