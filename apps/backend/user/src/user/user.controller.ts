import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedUser, RoleMatchingMode, Roles } from 'nest-keycloak-connect';
import { Jwt, ResourceOwnerGuard } from '@freshbox/backend-utils';
import { UuidParamsDto } from './dto/uuid-params.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Invalid credentials.' })
@ApiResponse({ status: 403, description: 'Forbidden.' })
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles({ roles: ['admin'], mode: RoleMatchingMode.ALL })
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'All users.', type: User, isArray: true })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':uuid')
  @UseGuards(ResourceOwnerGuard)
  @ApiOperation({ summary: 'Get an user by its uuid' })
  @ApiResponse({ status: 200, description: 'The user identified by its uuid', type: User })
  findOne(@Param() params: UuidParamsDto) {
    return this.userService.findOne(params.uuid);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 200,
    description: 'An object describing the result of the insertion.',
    content: {
      'application/json': { example: { affected: 1 } },
    },
  })
  create(@Body() createUserDto: CreateUserDto, @AuthenticatedUser() jwt: Jwt) {
    if (!jwt.resource_access?.backend?.roles?.includes('admin') && jwt.sub !== createUserDto.uuid) {
      throw new ForbiddenException();
    }

    return this.userService.create(createUserDto);
  }

  @Patch(':uuid')
  @UseGuards(ResourceOwnerGuard)
  @ApiOperation({ summary: 'Update a user by its uuid' })
  @ApiResponse({
    status: 200,
    description: 'An object describing the result of the update.',
    content: {
      'application/json': { example: { affected: 1 } },
    },
  })
  update(@Param('uuid') uuid: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(uuid, updateUserDto);
  }

  @Delete(':uuid')
  @UseGuards(ResourceOwnerGuard)
  @ApiOperation({ summary: 'Delete a user by its uuid' })
  @ApiResponse({
    status: 200,
    description: 'An object describing the result of the deletion.',
    content: {
      'application/json': { example: { affected: 1 } },
    },
  })
  remove(@Param() params: UuidParamsDto) {
    return this.userService.remove(params.uuid);
  }
}
