import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @IsString()
  @ApiProperty({ example: "8a081bec-8758-40fb-a247-e9fe5160922d"})
  readonly connectionId: string;

  @IsString()
  @ApiProperty({example: "Hello world"})
  readonly message: string;

}