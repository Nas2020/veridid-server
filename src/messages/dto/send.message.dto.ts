import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @IsString()
  @ApiProperty({example: { "connectionId": ''}})
  readonly connectionId: String;

  @IsString()
  @ApiProperty({example: { "message": 'Hello world'}})
  readonly message: String;

}