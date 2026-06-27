import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste/bourse-materiel.component').then(m => m.BourseMaterielComponent)
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./pages/form/form-materiel.component').then(m => m.FormMaterielComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/detail-materiel.component').then(m => m.DetailMaterielComponent)
  }
];
