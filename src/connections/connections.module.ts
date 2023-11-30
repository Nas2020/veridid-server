import { Module } from '@nestjs/common';
import { ConnectionsController } from './connections.controller.js';
import { ConnectionsService } from './connections.service.js';
import { AfjModule } from '../afj/afj.module.js';

@Module({
  imports: [AfjModule],
  controllers: [ConnectionsController],
  providers: [ConnectionsService]
})
export class ConnectionsModule {}
