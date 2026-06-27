import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste/suivi-logistique.component').then(m => m.SuiviLogistiqueComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/detail-logistique.component').then(m => m.DetailLogistiqueComponent)
  }
];
