import { Injectable, LogLevel } from '@nestjs/common';
import {
  KeycloakConnectOptions,
  KeycloakConnectOptionsFactory,
  TokenValidation,
} from 'nest-keycloak-connect';

@Injectable()
export class KeycloakConfigService implements KeycloakConnectOptionsFactory {
  createKeycloakConnectOptions(): KeycloakConnectOptions {
    let logLevels: LogLevel[] = ['log'];

    if (process.env['NODE_ENV'] === 'development') {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      logLevels = ['log', 'warn', 'debug', 'error'];
    }

    return {
      authServerUrl: 'https://localhost:8443',
      realm: 'freshbox',
      clientId: 'backend',
      secret: 'zakFDioxKRHu3hvDTCNfPaEauWbfvgEP',
      cookieKey: 'KEYCLOAK_JWT',
      logLevels,
      useNestLogger: true,
      tokenValidation: TokenValidation.OFFLINE,
    };
  }
}
