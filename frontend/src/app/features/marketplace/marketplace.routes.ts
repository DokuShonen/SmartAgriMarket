import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { producteurGuard } from '../../core/guards/producteur.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/catalogue/catalogue.component').then(m => m.CatalogueComponent)
  },
  {
    path: 'panier',
    loadComponent: () => import('./pages/panier/panier.component').then(m => m.PanierComponent),
    canActivate: [authGuard]
  },
  {
    path: 'commande',
    loadComponent: () => import('./pages/commande/commande.component').then(m => m.CommandeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'historique',
    loadComponent: () => import('./pages/historique/historique-commandes.component').then(m => m.HistoriqueCommandesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, producteurGuard]
  },
  {
    path: 'ventes',
    loadComponent: () => import('./pages/ventes/ventes.component').then(m => m.VentesComponent),
    canActivate: [authGuard, producteurGuard]
  },
  {
    path: 'ajouter',
    loadComponent: () => import('./pages/produit-form/produit-form.component').then(m => m.ProduitFormComponent),
    canActivate: [authGuard, producteurGuard]
  },
  {
    path: 'editer/:id',
    loadComponent: () => import('./pages/produit-form/produit-form.component').then(m => m.ProduitFormComponent),
    canActivate: [authGuard, producteurGuard]
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/detail-produit/detail-produit.component').then(m => m.DetailProduitComponent)
  }
];
