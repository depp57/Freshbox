import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_ROLES } from 'nest-keycloak-connect';
import { Jwt } from '../config/keycloak-config/jwt';
import { RoleDecoratorOptionsInterface } from 'nest-keycloak-connect/interface/role-decorator-options.interface';

export class MockRoleGuard implements CanActivate {
  private reflector = new Reflector();

  canActivate(context: ExecutionContext): boolean {
    const requiredRolesMetadata: RoleDecoratorOptionsInterface =
      this.reflector.get<RoleDecoratorOptionsInterface>(META_ROLES, context.getHandler());

    if (!requiredRolesMetadata) {
      return true;
    }

    const requiredRoles: string[] = requiredRolesMetadata.roles;
    const requiredRolesMatch = requiredRolesMetadata.mode ?? 'any';

    const encodedToken = context.switchToHttp().getRequest().headers['authorization'];
    if (!encodedToken) {
      return false;
    }
    const token: Jwt = JSON.parse(Buffer.from(encodedToken.split('.')[1], 'base64').toString());

    const userRoles = token.resource_access.backend?.roles;
    if (!userRoles) {
      return false;
    }

    return requiredRolesMatch === 'any'
      ? requiredRoles.some((role) => userRoles.includes(role))
      : requiredRoles.every((role) => userRoles.includes(role));
  }
}
