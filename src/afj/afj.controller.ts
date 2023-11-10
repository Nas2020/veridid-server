import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Schema } from 'indy-sdk'
import type { Agent, InitConfig } from '@aries-framework/core'
import { agentDependencies } from '@aries-framework/node'
import { AfjAgent } from './entities/afj.entity';
import { InitializeAfjDto } from './dto/initialize-afj.dto';
import { RequestProofDto } from './dto/request-proof.dto';
import { AfjService } from './afj.service';

@Controller('afj')
export class AfjController {
  constructor(private readonly afjService: AfjService) {}

  initDto = new InitializeAfjDto();
  afjAgent = new AfjAgent();
  oobRecord = null;
  schema = null;
  credDef = null;

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Here',
    type: String,
  })
  getHere(): String {
    return this.afjService.getHere();
  }

  @Get('invitation')
  @ApiOperation({ summary: 'Create connection invite' })
  @ApiResponse({ status: 200, description: 'Connection link', type: String })
  async createInvitation(): Promise<String> {
    this.oobRecord = this.afjService.createInvitation()
    return this.oobRecord
  }


  @Post('createAgent')
  @ApiOperation({ summary: 'Create and Initialize new Agent' })
  @ApiResponse({ status: 200, description: 'Agent Created', type: String })
  async createAgent(
    @Body() initializeAfjDto: InitializeAfjDto
  ): Promise<string> {
    try {
      return await this.afjService.createAgent(initializeAfjDto);
    } catch (error) {
      throw new Error(`Failed to initialize agent: ${error.message}`);
    }
  }

  @Post('invitationById/:id')
  @ApiOperation({ summary: 'Initialize Agent By agentID' })
  @ApiResponse({ status: 200, description: 'Agent Created', type: String })
  async createInvitationById(
    @Param('id') agentId: string
  ): Promise<any | undefined> {
    try {
      return await this.afjService.createInvitationById(agentId);
    } catch (error) {
      throw new Error(`Failed to initialize agent: ${error.message}`);
    }
  }


  @Get('agents')
  @ApiOperation({ summary: 'Get All Agents' })
  @ApiResponse({
    status: 200,
    description: 'Agent',
    type: String,
  })
  async getAllAgent(): Promise<any | undefined> {
    return this.afjService.getAllAgent();
  }

  @Get('agents/:id')
  @ApiOperation({ summary: 'Get Agents by agentId' })
  @ApiResponse({
    status: 200,
    description: 'Agent',
    type: String,
  })
  async getAgent(@Param('id') agentId: string): Promise<any | undefined> {
    return this.afjService.getAgent(agentId);
  }

  @Delete('agents/:id')
  @ApiOperation({ summary: 'Delete Agent by ID' })
  @ApiResponse({
    status: 200,
    description: 'Agent',
    type: String,
  })
  async deleteAgent(@Param('id') agentId: string): Promise<any | undefined> {
    return this.afjService.deleteAgent(agentId);
  }


  /*
      @Post('request-proof')
      @ApiOperation({ summary: 'Request proof' })
      @ApiResponse({status: 200, description: 'Sending proof request',type: String })
      async requestProof(@Body() requestProofDto: RequestProofDto): Promise<String> {
          console.log("Request Proof call")
          return this.ssiAgentsService.requestProof(requestProofDto)
      }
  */

  // @Post('initialize')
  // @ApiOperation({ summary: 'Initialize Agent' })
  // @ApiResponse({status: 200, description: 'Agent Created',type: String })
  // async initializeAgent(@Body() initializeSsiDto: InitializeSsiDto): Promise<String> {
  //   return await this.ssiAgentsService.initializeAgent(initializeSsiDto)
  // }

  /*    
      @Get('did')
      @ApiResponse({status: 200,type: String})
      getDID(): String {
        return "asdf";
      }
    
      @Get('oobs')
      @ApiResponse({status: 200,type: String})
      async getOOB(): Promise<String> {
          const outOfBandRecords = await this.ssiAgent.agent.oob.getAll()
          return JSON.stringify(outOfBandRecords);
      }
    
      @Get('connections')
      @ApiResponse({status: 200,type: String})
      async getConnections(): Promise<String> {
          const connectionRecords = await this.ssiAgent.agent?.connections.getAll()
          return JSON.stringify(connectionRecords);
      }
    
      @Get('credentials')
      @ApiResponse({status: 200,type: String})
      async getCredentials(): Promise<String> {
          const credentialRecords = await this.ssiAgent.agent.credentials.getAll()
          return JSON.stringify(credentialRecords);
      }
    
      @Get('proofs')
      @ApiResponse({status: 200,type: String})
      async getProofs(): Promise<String> {
          const proofRecords = await this.ssiAgent.agent.proofs.getAll()
          return JSON.stringify(proofRecords);
      }
    
      @Get('schemas')
      @ApiResponse({status: 200,type: String})
      async getSchemas(): Promise<any> {
        const _schema = {
          schemaId: "", //repository.getSchemaId(),
          credentialDefinitionId: "" //repository.getCredentialDefinitionId(),
        }
        return JSON.stringify(_schema);
      }
    
      // @Get('register-schema')
      // @ApiResponse({status: 200,type: String})
      // async getRegisterSchema(): Promise<String> {
      //     return "asdf";
      // }
  /*
        const template = {
            attributes: [
              'Name',
              'Surname',
              'Date of Birth',
              'Event Name',
              'Event Year',
            ],
            name: 'Conference Ticket',
            version: '1.0',
          }
          const schema = await agent.ledger.registerSchema(template)
          repository.saveSchemaId(schema.id)
          res.status(200).json({ schema })
        })
  */
  @Post('register-schema')
  @ApiOperation({ summary: 'Register Schema here' })
  @ApiResponse({ status: 200, description: 'Connection link', type: String })
  async registerSchema(): Promise<Schema> {
    this.schema = this.afjService.registerSchema_CredDef()
    console.log("MT-Controller this.schema: ", this.schema)
    return this.schema;
  }

  @Post('register-cred-def')
  @ApiOperation({ summary: 'Register Credentail definition here' })
  @ApiResponse({ status: 200, description: 'Connection link', type: String })
  async registerCredDef(): Promise<Object> {

    const getschema = this.schema.then((schema) => {
      this.credDef = this.afjService.registerCredDef(this.schema)
    })
    return this.credDef

  }

  @Post('issue-credential')
  @ApiOperation({ summary: 'Issue Credential here' })
  @ApiResponse({ status: 200, description: 'Connection link', type: String })
  async issueCred() {

    const getcredDef = this.credDef.then((credentialDef) => {
      this.afjService.issueCred(credentialDef)
    })
  }

  @Get('create-did')
  @ApiResponse({ status: 200, type: String })
  async getCreateDid(): Promise<String> {
    return "asdf";
  }

}
