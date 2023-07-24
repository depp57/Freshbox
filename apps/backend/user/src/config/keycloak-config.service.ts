import { Injectable } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    return {
      authServerUrl: 'https://localhost:8443',
      realm: 'freshbox',
      clientId: 'backend',
      secret: 'zakFDioxKRHu3hvDTCNfPaEauWbfvgEP',
      cookieKey: 'KEYCLOAK_JWT',
      logLevels: ['warn', 'log'],
      useNestLogger: false,
      tokenValidation: TokenValidation.OFFLINE,
    };
  }
}
