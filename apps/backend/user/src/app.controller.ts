import { Controller, Get } from '@nestjs/common';
import { AuthenticatedUser, Public, Roles } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  @Get()
  @Public(false)
  getHello(@AuthenticatedUser() user: any): any {
    if (user) {
      return user;
    } else {
      return JSON.stringify(process.env);
    }
  }

  @Get('private')
  getPrivate() {
    return 'Authenticated only!';
  }

  @Get('admin')
  @Roles({ roles: ['admin'] })
  adminRole() {
    return { message: 'Admin only!' };
  }
}
