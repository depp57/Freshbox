import { Module } from '@nestjs/common';
import { KeycloakConfigService } from './keycloak-config/keycloak-config.service';
import { AuthGuard, KeycloakConnectModule, RoleGuard } from 'nest-keycloak-connect';
import { KeycloakConfigModule } from './keycloak-config/keycloak-config.module';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakConnectModule.registerAsync({
      useExisting: KeycloakConfigService,
      imports: [KeycloakConfigModule],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [],
  providers: [
    // workaround by the creator of Nest https://github.com/nestjs/nest/issues/4053#issuecomment-585612462
    // that allows mocking these global guards
    {
      provide: APP_GUARD,
      useExisting: AuthGuard,
    },
    AuthGuard,
    {
      provide: APP_GUARD,
      useExisting: RoleGuard,
    },
    RoleGuard,
  ],
  exports: [KeycloakConnectModule, ConfigModule],
})
export class BackendConfigModule {}
