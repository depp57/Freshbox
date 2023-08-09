import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * The guard checks if the user making the request is either an admin or the owner of the resource.
 *
 * @remarks
 * It should only be used in routes with either a 'uuid' path parameter or body key.
 */
@Injectable()
export class ResourceOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const paramsUUID = request.params['uuid'] || request.body['uuid'];

    if (!paramsUUID) {
      throw new Error('AuthAccountOwnerGuard should only be used in route with uuid param');
    }

    const isAdmin = request.user.resource_access.backend?.roles?.includes('admin');

    return isAdmin || request.user.sub === paramsUUID;
  }
}
