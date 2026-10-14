import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste/suivi-logistique.component').then(m => m.SuiviLogistiqueComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/logistique-dashboard.component').then(m => m.LogistiqueDashboardComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/detail-logistique.component').then(m => m.DetailLogistiqueComponent)
  }
];
