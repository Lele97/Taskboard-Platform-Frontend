import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./components/auth/auth').then((m) => m.Auth),
  },
  {
    path: 'boards',
    loadComponent: () => import('./components/boards/boards').then((m) => m.Boards),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'boards',
  },
  {
    path: '**',
    redirectTo: 'boards',
  },
];
