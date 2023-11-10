import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessagesDto {
  @IsString()
  @ApiProperty({example: { "connectionId": ''}})
  readonly connectionId: String;
}