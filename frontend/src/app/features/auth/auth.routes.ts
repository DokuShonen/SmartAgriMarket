import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'connexion',
    loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/register.component').then(m => m.RegisterComponent)
  }
];
