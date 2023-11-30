import { IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import supertest from 'supertest';

export class ReceiveInvitationDto {
  @IsString()
  @ApiProperty({example: 'http://192.168.2.192:8000?c_i=eyJAdHlwZSI6Imh0dHBzOi8vZGlkY29tbS5vcmcvY29ubmVjdGlvbnMvMS4wL2ludml0YXRpb24iLCJAaWQiOiI3ZDAzZmNkZS00NDcyLTQxZWMtYWE3Zi1iMGEyYjI0OGFmY2EiLCJsYWJlbCI6ImRvY3Mtbm9kZWpzLWFnZW50IiwicmVjaXBpZW50S2V5cyI6WyJEbXBOU1JGY0tZU2dTcGp3N2VEMVo5U0FxdG83eFl6RGhMRjZ5TWtaNTFmbiJdLCJzZXJ2aWNlRW5kcG9pbnQiOiJodHRwOi8vMTkyLjE2OC4yLjE5Mjo4MDAwIiwicm91dGluZ0tleXMiOltdfQ'})
  readonly invitation: string;
}