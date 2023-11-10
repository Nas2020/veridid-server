import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConnectionsModule } from './connections/connections.module';
import { AfjModule } from './afj/afj.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConnectionsModule, AfjModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
