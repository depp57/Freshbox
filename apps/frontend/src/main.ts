import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withJsonpSupport } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  PreloadAllModules,
  provideRouter,
  withPreloading,
} from '@angular/router';
import { appRoutes } from './app/pages/routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withJsonpSupport()),
    provideAnimations(),
    provideRouter(appRoutes, withPreloading(PreloadAllModules)),
  ],
}).catch((error) => console.error(error));
