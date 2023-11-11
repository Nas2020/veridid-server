import { Injectable, BadRequestException } from '@nestjs/common';
import { Schema, CredDef } from 'indy-sdk'
import { Agent, AutoAcceptProof, BasicMessageEventTypes, BasicMessageStateChangedEvent, ConnectionEventTypes, ConnectionStateChangedEvent, ConsoleLogger, DidExchangeState, HttpOutboundTransport, InitConfig, LogLevel, ProofEventTypes, ProofStateChangedEvent, BasicMessageRole } from '@aries-framework/core';
import { InitializeAfjDto } from './dto/initialize-afj.dto';
import { HttpInboundTransport, agentDependencies } from '@aries-framework/node';
import { AfjAgent } from './entities/afj.entity';
import { KeyDerivationMethod } from '@aries-framework/core'


@Injectable()
export class AfjService {
  private agents: Map<string, object> = new Map<string, object>();
  afjAgent = new AfjAgent();

  setupConnectionListener = () => {
    this.afjAgent.agent.events.on<ConnectionStateChangedEvent>(ConnectionEventTypes.ConnectionStateChanged, ({ payload }) => {
      if (payload.connectionRecord.state === DidExchangeState.Completed) {
        // the connection is now ready for usage in other protocols!
        console.log("Connection completed", payload.connectionRecord)
        this.afjAgent.connection_id = payload.connectionRecord.id
        //process.exit(0)
      }
      else {
        console.log("Connection status", payload.connectionRecord)
      }
    })
  }

  schema1 = null;

  setupProofRequestListener() {
    console.log("Listen for proof")
    this.afjAgent.agent.events.on(ProofEventTypes.ProofStateChanged, async ({ payload }: ProofStateChangedEvent) => {
      //console.log("Proof presentation=",payload.proofRecord )
      console.log("Proof state: ", payload.proofRecord?.state)
      console.log("Proof verified: ", payload.proofRecord?.isVerified ? 'Verified' : 'not Verified')
    })
  }

  setupMessageListener() {
    console.log("Listen for messages")
    this.afjAgent.agent.events.on(BasicMessageEventTypes.BasicMessageStateChanged, async ({ payload }: BasicMessageStateChangedEvent) => {
      if (payload.basicMessageRecord.role === BasicMessageRole.Receiver) {
        console.log("Message:",payload.message.content);
      }
    })
  }

  //extractagent Info for getAllAgent 
  extractAgentInfo(agentMap: Map<string, any>): any {
    const result = {};
    agentMap.forEach((agents, key) => {
      result[key] = {
        agentId: agents.agentId,
        endpoint: agents.endpoint,
        inport: agents.inport,
      };
    });
    return result;
  }

  async createAgent(initAfj: InitializeAfjDto): Promise<string> {

    interface AgentInfo {
      agentId: string;
      endpoint: string;
      inport: number;
      agent: object;
    }

    if (this.agents.has(initAfj.agentId)) {
      throw new BadRequestException(`Agent with ID ${initAfj.agentId} already exists.`);

    }


    const config: InitConfig = {
      label: initAfj.label,
      logger: new ConsoleLogger(LogLevel.info),
      walletConfig: {
        id: initAfj.walletId,
        key: initAfj.walletKey,
        keyDerivationMethod: KeyDerivationMethod.Argon2IMod
      },
      publicDidSeed: initAfj.publicDIDSeed,
      indyLedgers: [
        {
          indyNamespace: 'BCovrinTest',
          genesisTransactions: process.env.BCovrinTest,
          id: 'BCovrinTest',
          isProduction: false,
        },
      ],
      autoAcceptConnections: true,
      autoAcceptProofs: AutoAcceptProof.ContentApproved,
      connectToIndyLedgersOnStartup: true,
      endpoints: [initAfj.agentConfig.endpoint + ':' + initAfj.agentConfig.inPort]
    }
    // Creating an agent instance
    const agent = new Agent({ config: config, dependencies: agentDependencies })


    // Registering the required in- and outbound transports
    agent.registerOutboundTransport(new HttpOutboundTransport())
    agent.registerInboundTransport(new HttpInboundTransport({ port: initAfj.agentConfig.inPort }))

    // Function to initialize the agent
    const initialize = async () => await agent.initialize().catch(console.error)
    await agent.initialize();
    this.afjAgent.agent = agent
    this.afjAgent.agentId = initAfj.agentId
    this.afjAgent.inPort = initAfj.agentConfig.inPort
    this.afjAgent.endpoint = initAfj.agentConfig.endpoint
    console.log("New agent = ", initAfj)
    //console.log("this.afjAgent from service", this.afjAgent)
    const agentInfo: AgentInfo = {
      agentId: this.afjAgent.agentId,
      endpoint: this.afjAgent.endpoint,
      inport: this.afjAgent.inPort,
      agent: this.afjAgent.agent
    }

    //console.log("agentInfo", agentInfo)
    this.setupConnectionListener()
    this.setupProofRequestListener()
    await this.agents.set(initAfj.agentId, agentInfo);
    return `Agent with agent ID ${this.afjAgent.agentId} successfully created and initialized`

  }



  async getAllAgent(): Promise<any | undefined> {

    const extractedAgents = this.extractAgentInfo(this.agents);
    if (this.agents.size == 0) return "No Agents Found"
    return `Total ${this.agents.size} Agents and the List is ${JSON.stringify(extractedAgents)}`;
  }

  async getAgent(agentId: string): Promise<any | undefined> {
    if (!this.agents.get(agentId)) return "ERROR!!!Agent not found. Make sure agentId is correct"

    const id = this.agents.get(agentId)["agentId"];
    const endpoint = this.agents.get(agentId)["endpoint"];
    const inport = this.agents.get(agentId)["inport"];
    return {
      id, endpoint, inport
    };
  }

  async deleteAgent(agentId: string): Promise<any | undefined> {
    if (!this.agents.get(agentId)) return "ERROR!!!Agent not found. Make sure agentId is correct"
    if (!this.agents.delete(agentId)) return "ERROR!!!Agent not deleted. Try again"
    return `Agent with ID: ${agentId} deleted successfully`;
  }

  async createInvitation(): Promise<String> {

    
    var outOfBandRecord = await this.afjAgent.agent.oob.createLegacyInvitation()
    var invite = {
      invitationUrl: outOfBandRecord.invitation.toUrl({ domain: this.afjAgent.endpoint + ':' + this.afjAgent.inPort }),
      outOfBandRecord
    }
    /*
    const outOfBandRecord = await this.afjAgent.agent.oob.createInvitation()
    var invite = {
      invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://'+this.afjAgent.endpoint+':'+this.afjAgent.inPort }),
      outOfBandRecord,
    }
    */
    console.log(`invitation from agent ${this.afjAgent.agentId}, invitation URL is ${invite.invitationUrl}`)
    return invite.invitationUrl
  }

  async createInvitationById(agentId: string): Promise<any | undefined> {

    const agent = this.agents.get(agentId)["agent"]
    var outOfBandRecord = await agent.oob.createLegacyInvitation()
    var invite = {
      invitationUrl: outOfBandRecord.invitation.toUrl({ domain: this.afjAgent.endpoint + ':' + this.afjAgent.inPort }),
      outOfBandRecord
    }

    /*
    const outOfBandRecord = await ssiAgent.agent.oob.createInvitation()
    var invite = {
      invitationUrl: outOfBandRecord.outOfBandInvitation.toUrl({ domain: 'http://'+ssiAgent.endpoint+':'+ssiAgent.inPort }),
      outOfBandRecord,
    }
    */
    console.log(`invitation from agent ${this.agents.get(agentId)["agentId"]}, invitation URL is ${invite.invitationUrl}`)
    return invite.invitationUrl
  }

  receiveInvitation = async (invitationUrl: string) => {
    console.log("Invitation URL=", invitationUrl)
    const { outOfBandRecord } = await this.afjAgent.agent.oob.receiveInvitationFromUrl(invitationUrl)
  
    return outOfBandRecord
  }

  async issueCred(credDef: CredDef) {

    const connectionId = this.afjAgent.connection_id;
    const credentialDefinitionId = credDef.id;

    const vcred = await this.afjAgent.agent.credentials.offerCredential({
      protocolVersion: 'v1',
      connectionId,
      credentialFormats: {
        indy: {
          credentialDefinitionId,
          attributes: [
            { name: 'name', value: 'Mayank Tomar' },
            { name: 'age', value: '29' },
          ],
        },
      },
    })

    console.log("Issued Credential: ", vcred)
  }

  async registerSchema_CredDef(): Promise<Schema> {
    const schema = await this.afjAgent.agent.ledger.registerSchema({
      attributes: ['name', 'age'],
      name: 'Identity',
      version: '1.0'
    })
    console.log("Registering schema: ", schema);
    return schema;
  }

  async registerCredDef(schema: Schema): Promise<Object> {
    const credDef = await this.afjAgent.agent.ledger.registerCredentialDefinition({
      schema,
      supportRevocation: false,
      tag: 'default'
    })
    console.log("Registering Cred Def: ", credDef);
    return credDef;

  }

  getInPort(): number {
    console.log("port is:", this.afjAgent.inPort)
    return this.afjAgent.inPort;
  }
  getHere(): String {
    return "AFJ Test Module";
  }
} 
