import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { AfjModule } from '../afj/afj.module';


@Module({
  imports: [AfjModule],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule {}
