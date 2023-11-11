import { Inject, Injectable } from '@nestjs/common';
import { AfjService  } from '../afj/afj.service';
import { SendMessageDto } from './dto/send.message.dto';

@Injectable()
export class MessagesService {
    constructor(@Inject(AfjService) private afjService: AfjService) {}
    
    getHere(): String {
        return "Messages Test Module";
    }

    async getMessages(id:string): Promise<any> {
        console.log("Messages service - get messages for connection id=", id)
        const messages = await this.afjService.afjAgent.agent.basicMessages.findAllByQuery({connectionId: id});
        console.log("Connection=", messages)
        return messages
    }

    async sendMessage(sendMessageDto:SendMessageDto): Promise<any> {
        console.log("Messages service - send messages for connection id=", sendMessageDto.connectionId)
        const messages = await this.afjService.afjAgent.agent.basicMessages.sendMessage(sendMessageDto.connectionId, sendMessageDto.message)
        //this.afjService.afjAgent.agent.basicMessages.findAllByQuery()
        console.log("Connection=", messages)
        return messages
    }

}
