import { Module } from '@nestjs/common';
import { AfjController } from './afj.controller.js';
import { AfjService } from './afj.service.js';

@Module({
  controllers: [AfjController],
  providers: [AfjService],
  exports: [AfjService],
})
export class AfjModule {}
