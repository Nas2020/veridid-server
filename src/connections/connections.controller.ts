import { Body, Controller, Get, Param, Res, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { ConnectionsService } from './connections.service';
import { GetListDto } from './dto/getlist.dto';
import { ReceiveInvitationDto } from './dto/receive.invitation.dto';

@Controller('Connections')
export class ConnectionsController {
    constructor(private readonly connectionsService: ConnectionsService) {}

    @ApiTags('connections')
    @Get('')
    async getListClassic(@Res() response): Promise<any> {
      const values = await this.connectionsService.getListClassicPlain();
      response.status(200).send(values);
    }

    @ApiTags('connections')
    @Get('/create-invitation')
    async createInviteClassic(@Res() response): Promise<any> {
      const url = await this.connectionsService.createInviteClassic();
      response.status(200).send(url);
    }

    @ApiTags('connections')
    @Post('/receive-invitation')
    async receiveInvitation(@Res() response, @Body() receiveInvitationDto: ReceiveInvitationDto): Promise<any> {
      const invitation = receiveInvitationDto.invitation;
      const values = await this.connectionsService.receiveInvitation(invitation)
      response.status(200).send(values);
    }


/*
    // http://localhost:3000/Connections?_end=10&_order=ASC&_sort=id&_start=0
    @ApiTags('connections')
    @Get('/getlist-oob')
    async getListOOB(@Res() response, @Query() query: {"_end": number, "_order": string, "_sort": string, "_start": number}): Promise<any> {
      const values = await this.connectionsService.getListOOB(query)
      response.set('Access-Control-Expose-Headers', 'X-Total-Count')
      response.set('X-Total-Count', values.total)
      response.status(200).send(values.page);
    }

    @ApiTags('connections')
    @Get('/getone/:id')
    async getOne(@Res() response, @Param('id') id:string): Promise<any> {
      response.status(200).send(await this.connectionsService.getOne(id));
    }
    
    @ApiTags('connections')
    @Get('/getmany')
    getMany(): String {
      return this.connectionsService.getHere();
    }
    
    @ApiTags('connections')
    @Get('/getmanyref')
    getManyReference(): String {
      return this.connectionsService.getHere();
    }
    
    @ApiTags('connections')
    @Get('/createinvite')
    create(): String {
      return this.connectionsService.getHere();
    }
    
    @ApiTags('connections')
    @Get('/update/:id')
    update(): String {
      return this.connectionsService.getHere();
    }

    @ApiTags('connections')
    @Get('/updatemany')
    updateMany(): String {
      return this.connectionsService.getHere();
    }

    @ApiTags('connections')
    @Get('/delete/:id')
    delete(): String {
      return this.connectionsService.getHere();
    }

    @ApiTags('connections')
    @Get('/deletemany')
    deleteMany(): String {
      return this.connectionsService.getHere();
    }
*/
}
