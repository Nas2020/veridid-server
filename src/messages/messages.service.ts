import { Inject, Injectable } from '@nestjs/common';
import { AfjService  } from '../afj/afj.service';
import { BasicMessageRecord } from '@aries-framework/core'

@Injectable()
export class MessagesService {
    constructor(@Inject(AfjService) private afjService: AfjService) {}
    
    getHere(): String {
        return "Messages Test Module";
    }

    async getMessages(id:String): Promise<any> {
        console.log("Messages service - get messages for connection id")
        const messages = await this.afjService.afjAgent.agent.basicMessages.findAllByQuery({connectionId: id.toString()});
        console.log("Connection=", messages)
        return messages
    }
}
