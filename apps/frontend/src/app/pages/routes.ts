import { Routes } from '@angular/router';
import { AuthGuard } from '@core/services/auth.guard';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./homepage/homepage.component'),
  },
  {
    path: 'authenticated',
    loadComponent: () => import('./authenticated/authenticated.component'),
    canActivate: [AuthGuard],
    data: { roles: ['admin'] },
  },
];
