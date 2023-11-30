import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { VeramoService } from './veramo.service.js';

@Controller('veramo')
export class VeramoController {
    constructor(private readonly veramoService: VeramoService) {}

    @ApiTags('veramo')
    @Get()
    @ApiResponse({
      status: 200,
      description: 'Here',
      type: String,
    })
    getHere(): String {
      return this.veramoService.getHere();
    }

    //createIdentifier
    @ApiTags('veramo')
    @Get('createdid')
    @ApiResponse({
      status: 200,
      description: 'Create a DID',
      type: String,
    })
    createIdentifier(): Promise<String> {
      return this.veramoService.createIdentifier();
    }
    
    //listIdentifiers
    @ApiTags('veramo')
    @Get('listidentifiers')
    @ApiResponse({
      status: 200,
      description: 'Create a DID',
      type: String,
    })
    listIdentifiers(): Promise<String> {
      return this.veramoService.listIdentifiers();
    }
    
    //CreateIdentifier
    @ApiTags('veramo')
    @Get('createcredential')
    @ApiResponse({
      status: 200,
      description: 'Create a credential',
      type: String,
    })
    createCredential(): Promise<String> {
      return this.veramoService.createCredential();
    }

    //CreateOOBInvitation
    @ApiTags('veramo')
    @Get('createoobinvite')
    @ApiResponse({
      status: 200,
      description: 'Create a credential',
      type: String,
    })
    createOOBInvite(): Promise<String> {
      return this.veramoService.createOOBInvite();
    }
    
}
