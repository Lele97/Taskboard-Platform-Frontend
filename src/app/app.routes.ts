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
    path: 'boards/:id',
    loadComponent: () => import('./components/board-detail/board-detail').then((m) => m.BoardDetail),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth',
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
