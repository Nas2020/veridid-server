import { Module } from '@nestjs/common';
import { VeramoController } from './veramo.controller.js';
import { VeramoService } from './veramo.service.js';

@Module({
  controllers: [VeramoController],
  providers: [VeramoService]
})
export class VeramoModule {}
