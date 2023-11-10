import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AgentConfigDto {
  @IsString()
  @ApiProperty({
    description: 'Agent endpoint URL',
    example: "afj-test.veridid.services",
  })
  endpoint: string;

  @IsInt()
  @ApiProperty({
    description: 'Agent port number',
    example: 8000,
  })
  inPort: number;

  @IsString()
  @ApiProperty({
    description: 'Agent label',
    example: 'Organization 1',
  })
  label: string;
}

export class InitializeAfjDto {


  @IsString()
  @ApiProperty({description: 'agentId',example: "organization1"})
   agentId: string;

  @IsString()
  @ApiProperty({
    description: 'label',
    example: "docs-nodejs-agent",
  })
   label: string;

   @IsString()
   @ApiProperty({
     description: 'walletId',
     example: "wallet-id",
   })
    walletId: string;

    @IsString()
    @ApiProperty({
      description: 'walletKey',
      example: 'testkey0000000000000000000000000',
    })
     walletKey: string;

     @IsString()
     @ApiProperty({
       description: 'publicDIDSeed',
       example: 'demoissuerdidseed300000000000021',
     })
      publicDIDSeed: string;

  @ApiProperty({
    description: 'Agent configuration',
    type: AgentConfigDto,
  })

  "agentConfig": AgentConfigDto

}
