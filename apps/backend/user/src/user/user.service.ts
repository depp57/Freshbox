import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult, InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async create(createUserDto: CreateUserDto): Promise<InsertResult> {
    const isAlreadyCreated = await this.userRepository.findOneBy({
      uuid: createUserDto.uuid,
    });

    if (isAlreadyCreated) {
      throw new BadRequestException('A user with the same uuid already exists');
    }

    return this.userRepository.insert(createUserDto);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(uuid: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ uuid });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(uuid: string, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ uuid });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.update({ uuid }, user);
  }

  remove(uuid: string): Promise<DeleteResult> {
    return this.userRepository.delete({ uuid });
  }
}
