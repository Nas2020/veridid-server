import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestProofDto {
  @IsString()
  @ApiProperty({example: "XF5sGaa8ncym58CsbAUSu2:3:CL:524488:India"})
  readonly credDefId: string;

}