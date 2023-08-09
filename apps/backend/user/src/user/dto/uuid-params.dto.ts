import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UuidParamsDto {
  @IsUUID()
  @ApiProperty({ example: 'ba8aac2b-5ae6-4a29-8c68-b8fb314047db' })
  uuid: string;
}
