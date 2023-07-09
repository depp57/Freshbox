import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./homepage/homepage.component'),
  },
];
