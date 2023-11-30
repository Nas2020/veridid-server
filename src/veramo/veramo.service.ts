import { Injectable } from '@nestjs/common';

// Core interfaces
import {
    createAgent,
    IDIDManager,
    IResolver,
    IDataStore,
    IDataStoreORM,
    IKeyManager,
    ICredentialPlugin,
} from '@veramo/core';


//const {createAgent,IDIDManager,IResolver,IDataStore,IDataStoreORM,IKeyManager,ICredentialPlugin} = await dynamicImport('@veramo/core', module) as typeof import('@veramo/core');

// Core identity manager plugin
import { DIDManager } from '@veramo/did-manager'

// Ethr did identity provider
import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// Web did identity provider
import { WebDIDProvider } from '@veramo/did-provider-web'

// Peer did identity provider
import { PeerDIDProvider } from '@veramo/did-provider-peer'

// Core key manager plugin
import { KeyManager } from '@veramo/key-manager'

// Custom key management system for RN
import { KeyManagementSystem, SecretBox } from '@veramo/kms-local'

// W3C Verifiable Credential plugin
import { CredentialPlugin } from '@veramo/credential-w3c'

// Custom resolvers
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
import { getResolver as webDidResolver } from 'web-did-resolver'

// Storage plugin using TypeOrm
import { Entities, KeyStore, DIDStore, PrivateKeyStore, migrations } from '@veramo/data-store'

// TypeORM is installed with `@veramo/data-store`
import { DataSource } from 'typeorm'

import { INFURA_PROJECT_ID, KMS_SECRET_KEY } from './veramo.settings.js'

// This will be the name for the local sqlite database for demo purposes
const DATABASE_FILE = 'database.sqlite'

const dbConnection = new DataSource({
    type: 'sqlite',
    database: DATABASE_FILE,
    synchronize: false,
    migrations,
    migrationsRun: true,
    logging: ['error', 'info', 'warn'],
    entities: Entities,
}).initialize()

@Injectable()
export class VeramoService {

    agent = createAgent<IDIDManager & IKeyManager & IDataStore & IDataStoreORM & IResolver & ICredentialPlugin> ({
        plugins: [
            new KeyManager({
                store: new KeyStore(dbConnection),
                kms: {
                local: new KeyManagementSystem(new PrivateKeyStore(dbConnection, new SecretBox(KMS_SECRET_KEY))),
                },
            }),
            new DIDManager({
                store: new DIDStore(dbConnection),
                defaultProvider: 'did:web',
                providers: {
                'did:web': new WebDIDProvider({
                    defaultKms: 'local',
                }),
                'did:peer': new PeerDIDProvider({
                    defaultKms: 'local',
                }),
                'did:key': new PeerDIDProvider({
                  defaultKms: 'local',
              }),
            },
            }),
            new DIDResolverPlugin({
                resolver: new Resolver({
                ...ethrDidResolver({ infuraProjectId: INFURA_PROJECT_ID }),
                ...webDidResolver(),
                }),
            }),
            new CredentialPlugin(),
        ],
    })

    getHere(): String {
        return "Veramo Test Module";
    }

    async createIdentifier(): Promise<String> {
        const identifier = await this.agent.didManagerCreate({ alias: 'default' })
        console.log(`New identifier created`)
        console.log(JSON.stringify(identifier, null, 2))
        return JSON.stringify(identifier, null, 2);
    }

    async listIdentifiers(): Promise<any> {
        const identifiers = await this.agent.didManagerFind()

        console.log(`There are ${identifiers.length} identifiers`)
      
        if (identifiers.length > 0) {
          identifiers.map((id) => {
            console.log(id)
            console.log('..................')
          })
        }
        return identifiers;      
    }

    async createCredential(): Promise<any> {
        const identifier = await this.agent.didManagerGetByAlias({ alias: 'default' })

        const verifiableCredential = await this.agent.createVerifiableCredential({
          credential: {
            issuer: { id: identifier.did },
            credentialSubject: {
              id: 'did:web:example.com',
              you: 'Rock',
            },
          },
          proofFormat: 'jwt',
        })
        console.log(`New credential created`)
        console.log(JSON.stringify(verifiableCredential, null, 2))        
        return verifiableCredential;
    }

    async verifyCredential(): Promise<any> {
        const result = await this.agent.verifyCredential({
            credential: {
              credentialSubject: {
                you: 'Rock',
                id: 'did:web:example.com',
              },
              issuer: {
                id: 'did:ethr:goerli:0x0350eeeea1410c5b152f1a88e0ffe8bb8a0bc3df868b740eb2352b1dbf93b59c16',
              },
              type: ['VerifiableCredential'],
              '@context': ['https://www.w3.org/2018/credentials/v1'],
              issuanceDate: '2022-10-28T11:54:22.000Z',
              proof: {
                type: 'JwtProof2020',
                jwt: 'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJ2YyI6eyJAY29udGV4dCI6WyJodHRwczovL3d3dy53My5vcmcvMjAxOC9jcmVkZW50aWFscy92MSJdLCJ0eXBlIjpbIlZlcmlmaWFibGVDcmVkZW50aWFsIl0sImNyZWRlbnRpYWxTdWJqZWN0Ijp7InlvdSI6IlJvY2sifX0sInN1YiI6ImRpZDp3ZWI6ZXhhbXBsZS5jb20iLCJuYmYiOjE2NjY5NTgwNjIsImlzcyI6ImRpZDpldGhyOmdvZXJsaToweDAzNTBlZWVlYTE0MTBjNWIxNTJmMWE4OGUwZmZlOGJiOGEwYmMzZGY4NjhiNzQwZWIyMzUyYjFkYmY5M2I1OWMxNiJ9.EPeuQBpkK13V9wu66SLg7u8ebY2OS8b2Biah2Vw-RI-Atui2rtujQkVc2t9m1Eqm4XQFECfysgQBdWwnSDvIjw',
              },
            },
          })
          console.log(`Credential verified`, result.verified)        
    }

    async createOOBInvite(): Promise<any> {
        // Create a Peer DID to use for this connection
        const identifier = await this.agent.didManagerCreate({ options: {service: "http://192.168.2.192:3000", num_algo: 2}, alias: 'dave-promulgare:github.io:dave:invite' })
        console.log(`New identifier created`)
        console.log(JSON.stringify(identifier, null, 2))
        return JSON.stringify(identifier, null, 2);
    }
}
