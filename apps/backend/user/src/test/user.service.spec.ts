import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { MockTypeOrmModule } from '@freshbox/backend-utils';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MockTypeOrmModule(), TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('can create an instance of user service', () => {
    expect(service).toBeDefined();
  });

  it('can create a new user', async () => {
    const uuid = '1';

    await service.create({
      uuid,
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });
    const createdUser = await service.findOne(uuid);

    expect(createdUser).toBeDefined();
  });

  it('throws an exception if a user with the same uuid is created twice', async () => {
    const uuid = '1';

    await service.create({
      uuid,
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });

    await expect(
      service.create({
        uuid,
        address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
        phone: 'foo',
      })
    ).rejects.toThrow(BadRequestException);
  });

  it('can get all users', async () => {
    await service.create({
      uuid: '1',
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });

    await service.create({
      uuid: '2',
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });

    const users = await service.findAll();

    expect(users).toHaveLength(2);
  });

  it('can get a user by its uuid', async () => {
    const uuid = '1';

    await service.create({
      uuid,
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });

    const user = await service.findOne(uuid);

    expect(user).toBeDefined();
  });

  it('findOne throws 404 error if a wrong uuid is provided', async () => {
    const uuid = 'wrong-uuid';

    await expect(service.findOne(uuid)).rejects.toThrow(NotFoundException);
  });

  it('can update a user identified by its uuid', async () => {
    const uuid = '1';

    await service.create({
      uuid,
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });

    const updateDto: UpdateUserDto = {
      phone: 'example-phone',
    };
    await service.update(uuid, updateDto);
    const updatedUser = await service.findOne(uuid);

    expect(updatedUser.phone).toEqual('example-phone');
  });

  it('throws an exception if a wrong uuid is provided when updating a user', async () => {
    const uuid = 'wrong-uuid';

    const updateDto: UpdateUserDto = {
      phone: 'example-phone',
    };

    await expect(service.update(uuid, updateDto)).rejects.toThrow(NotFoundException);
  });

  it('can delete a user by its uuid', async () => {
    const uuid = '1';

    await service.create({
      uuid,
      address: { city: 'foo', country: 'bar', street: 'baz', zipcode: 'foobar' },
      phone: 'foo',
    });

    const deleteResult = await service.remove(uuid);

    expect(deleteResult.affected).toEqual(1);
  });

  it('does nothing when a wrong uuid is provided when deleting a user', async () => {
    const uuid = 'wrong-uuid';

    const deleteResult = await service.remove(uuid);

    expect(deleteResult.affected).toEqual(0);
  });
});
