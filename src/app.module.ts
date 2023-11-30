import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ConnectionsModule } from './connections/connections.module.js';
import { AfjModule } from './afj/afj.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { VeramoModule } from './veramo/veramo.module.js';

@Module({
  imports: [ConnectionsModule, AfjModule, MessagesModule, VeramoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
