import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller.js';
import { MessagesService } from './messages.service.js';
import { AfjModule } from '../afj/afj.module.js';


@Module({
  imports: [AfjModule],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
