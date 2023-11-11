import { Body, Controller, Get, Param, Res, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { MessagesDto } from './dto/messages.dto';
import { SendMessageDto } from './dto/send.message.dto';
import { Console } from 'console';

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    // http://localhost:3000/Connections?_end=10&_order=ASC&_sort=id&_start=0
/*
    @ApiTags('messages')
    @Get('/getlist-oob')
    async getListOOB(@Res() response, @Query() query: {"_end": number, "_order": string, "_sort": string, "_start": number}): Promise<any> {
      const values = await this.messagesService.getListOOB(query)
      response.set('Access-Control-Expose-Headers', 'X-Total-Count')
      response.set('X-Total-Count', values.total)
      response.status(200).send(values.page);
    }
*/
    @ApiTags('messages')
    @Post('')
    async getMessages(@Res() response, @Body() messagesDto: MessagesDto): Promise<any> {
      console.log("MessageDto: ", messagesDto)
      const values = await this.messagesService.getMessages(messagesDto.connectionId);
      response.status(200).send(values);
    }

    @ApiTags('messages')
    @Post('send-message')
    async sendMessage(@Res() response, @Body() sendMessageDto: SendMessageDto): Promise<any> {
      console.log("SendMessageDto: ", sendMessageDto)
      const values = await this.messagesService.sendMessage(sendMessageDto);
      response.status(200).send(values);
    }


/*
    @ApiTags('connemessagesctions')
    @Get('/getone/:id')
    async getOne(@Res() response, @Param('id') id:string): Promise<any> {
      response.status(200).send(await this.messagesService.getOne(id));
    }
    
    @ApiTags('messages')
    @Get('/getmany')
    getMany(): String {
      return this.messagesService.getHere();
    }
    
    @ApiTags('messages')
    @Get('/getmanyref')
    getManyReference(): String {
      return this.messagesService.getHere();
    }
    
    @ApiTags('messages')
    @Get('/createinvite')
    create(): String {
      return this.messagesService.getHere();
    }
    
    @ApiTags('connmessagesections')
    @Get('/update/:id')
    update(): String {
      return this.messagesService.getHere();
    }

    @ApiTags('messages')
    @Get('/updatemany')
    updateMany(): String {
      return this.messagesService.getHere();
    }

    @ApiTags('messages')
    @Get('/delete/:id')
    delete(): String {
      return this.messagesService.getHere();
    }

    @ApiTags('messages')
    @Get('/deletemany')
    deleteMany(): String {
      return this.messagesService.getHere();
    }
*/

}
