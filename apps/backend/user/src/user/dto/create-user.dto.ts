import { IsObject, IsPhoneNumber, IsUUID, ValidateNested } from 'class-validator';
import { Address } from '../entities/user.entity';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsUUID()
  @ApiProperty({ example: 'ba8aac2b-5ae6-4a29-8c68-b8fb314047db' })
  uuid: string;

  @IsPhoneNumber()
  @ApiProperty({ example: '+33682123456' })
  phone: string;

  @IsObject()
  @ValidateNested()
  @Type(() => Address)
  @ApiProperty()
  address: Address;
}
