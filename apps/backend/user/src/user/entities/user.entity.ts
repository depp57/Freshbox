import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class Address {
  @IsString()
  @ApiProperty({ example: '31500' })
  zipcode: string;

  @IsString()
  @ApiProperty({ example: '20 rue Maud' })
  street: string;

  @IsString()
  @ApiProperty({ example: 'Toulouse' })
  city: string;

  @IsString()
  @ApiProperty({ example: 'France' })
  country: string;
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ example: 'ba8aac2b-5ae6-4a29-8c68-b8fb314047db' })
  uuid: string;

  @Column()
  @ApiProperty({ example: '+33682123456' })
  phone: string;

  @Column({ type: 'json' })
  @ApiProperty({
    example: {
      zipcode: '31500',
      street: '20 rue Maud',
      city: 'Toulouse',
      country: 'France',
    },
  })
  address: Address;
}
