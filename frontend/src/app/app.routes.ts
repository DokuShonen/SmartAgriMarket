import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      { path: '', loadComponent: () => import('./features/accueil/pages/accueil.component').then(m => m.AccueilComponent) },
      { path: 'produits', loadChildren: () => import('./features/marketplace/marketplace.routes').then(m => m.routes) },
      { path: 'materiel', loadChildren: () => import('./features/materiel/materiel.routes').then(m => m.routes) },
      { path: 'messagerie', loadChildren: () => import('./features/messagerie/messagerie.routes').then(m => m.routes), canActivate: [authGuard] },
      { path: 'forum', loadChildren: () => import('./features/forum/forum.routes').then(m => m.routes) },
      { path: 'agent-relais', loadChildren: () => import('./features/agent-relais/agent-relais.routes').then(m => m.routes), canActivate: [authGuard] },
      { path: 'connexion', loadComponent: () => import('./features/auth/pages/login.component').then(m => m.LoginComponent) },
      { path: 'inscription', loadComponent: () => import('./features/auth/pages/register.component').then(m => m.RegisterComponent) },
      { path: 'mot-de-passe-oublie', loadComponent: () => import('./features/auth/pages/forgot-password.component').then(m => m.ForgotPasswordComponent) },
      { path: 'profil', loadComponent: () => import('./features/profil/pages/profil.component').then(m => m.ProfilComponent), canActivate: [authGuard] },
      { path: 'admin', loadComponent: () => import('./features/admin/pages/admin-panel.component').then(m => m.AdminPanelComponent), canActivate: [authGuard, adminGuard] },
    ]
  },
  { path: '**', redirectTo: '' }
];
