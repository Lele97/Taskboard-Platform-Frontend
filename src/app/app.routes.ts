import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth/auth-guard';
import { noAuthGuard } from './shared/guards/auth/no-auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    canActivate: [noAuthGuard],
    loadComponent: () => import('./components/auth/auth').then((m) => m.Auth)
  },
  {
    path: 'boards',
    canActivate: [authGuard],
    loadComponent: () => import('./components/boards/boards').then((m) => m.Boards)
  },
  {
    path: 'boards/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/board-detail/board-detail').then((m) => m.BoardDetail)
  },
  {
    path: 'analytics/boards',
    canActivate: [authGuard],
    loadComponent: () => import('./components/board-analitycs/board-analitycs').then((m) => m.BoardAnalitycs)
  },
  {
    path: 'analytics/boards/:boardId',
    canActivate: [authGuard],
    loadComponent: () => import('./components/board-analitycs/board-analitycs').then((m) => m.BoardAnalitycs)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'boards'
  },
  {
    path: '**',
    redirectTo: 'boards'
  }
];
