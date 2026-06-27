import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/catalogue/catalogue.component').then(m => m.CatalogueComponent)
  },
  {
    path: 'panier',
    loadComponent: () => import('./pages/panier/panier.component').then(m => m.PanierComponent)
  },
  {
    path: 'commande',
    loadComponent: () => import('./pages/commande/commande.component').then(m => m.CommandeComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./pages/produit-form/produit-form.component').then(m => m.ProduitFormComponent)
  },
  {
    path: 'editer/:id',
    loadComponent: () => import('./pages/produit-form/produit-form.component').then(m => m.ProduitFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail-produit/detail-produit.component').then(m => m.DetailProduitComponent)
  }
];
