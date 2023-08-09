import { Module } from '@nestjs/common';
import { KeycloakConfigService } from './keycloak-config.service';
import { ResourceOwnerGuard } from './resource-owner-guard.service';

@Module({
  providers: [KeycloakConfigService, ResourceOwnerGuard],
  exports: [KeycloakConfigService, ResourceOwnerGuard],
})
export class KeycloakConfigModule {}
