import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withInterceptorsFromDi, withJsonpSupport } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { appRoutes } from './app/pages/routes';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { APP_INITIALIZER, importProvidersFrom, isDevMode } from '@angular/core';
import { env } from '@env/environment.development';
import { provideServiceWorker } from '@angular/service-worker';

function initKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
    keycloak.init({
      config: {
        url: 'https://localhost:8443',
        realm: 'freshbox',
        clientId: env.KEYCLOAK_CLIENT,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withJsonpSupport(), withInterceptorsFromDi()),
    provideAnimations(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
    importProvidersFrom(KeycloakAngularModule),
    {
        provide: APP_INITIALIZER,
        useFactory: initKeycloak,
        multi: true,
        deps: [KeycloakService],
    },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
}).catch((error) => console.error(error));
