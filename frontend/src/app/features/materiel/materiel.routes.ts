import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { producteurGuard } from '../../core/guards/producteur.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste/bourse-materiel.component').then(m => m.BourseMaterielComponent)
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./pages/form/form-materiel.component').then(m => m.FormMaterielComponent),
    canActivate: [authGuard, producteurGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/detail-materiel.component').then(m => m.DetailMaterielComponent)
  }
];
