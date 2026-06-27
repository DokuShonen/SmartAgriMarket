import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste/forum-liste.component').then(m => m.ForumListeComponent)
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./pages/form/forum-form.component').then(m => m.ForumFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail/forum-detail.component').then(m => m.ForumDetailComponent)
  }
];
