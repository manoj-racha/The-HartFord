import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'transactions',
    loadComponent: () =>
      import('./components/transactions/transaction-list/transaction-list')
        .then(m => m.TransactionListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'accounts',
    loadComponent: () =>
      import('./components/accounts/account-list/account-list')
        .then(m => m.AccountListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/dashboard/dashboard').then(m => m.DashboardComponent),
    canActivate: [authGuard, adminGuard]
  },

  { path: '**', redirectTo: 'dashboard' }
];
