import { CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_UNPROTECTED } from 'nest-keycloak-connect';

export class MockAuthGuard implements CanActivate {
  private reflector = new Reflector();

  canActivate(context: ExecutionContext): boolean {
    const isFunctionPublic: boolean = this.reflector.get<boolean>(
      META_UNPROTECTED,
      context.getHandler()
    );
    const isClassPublic: boolean = this.reflector.get<boolean>(
      META_UNPROTECTED,
      context.getClass()
    );
    const encodedToken = context.switchToHttp().getRequest().headers['authorization'];

    let hasAccess: boolean;

    if (isFunctionPublic) {
      hasAccess = true;
    } else if (isFunctionPublic === undefined) {
      hasAccess = isClassPublic || encodedToken !== undefined;
    } else {
      hasAccess = encodedToken !== undefined;
    }

    if (!hasAccess) {
      throw new UnauthorizedException();
    }

    if (encodedToken) {
      context.switchToHttp().getRequest().user = JSON.parse(
        Buffer.from(encodedToken.split('.')[1], 'base64').toString()
      );
    }

    return true;
  }
}
