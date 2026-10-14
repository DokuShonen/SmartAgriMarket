import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { retry, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading.component';
import { SearchBarComponent } from '../../../../shared/components/search-bar.component';
import { FilterChipsComponent, FilterChip } from '../../../../shared/components/filter-chips.component';
import { ProductCardComponent } from '../../../../shared/components/product-card.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state.component';
import { ProduitService, PageResponse, ProduitSearchParams } from '../../../../core/services/produit.service';
import { Produit } from '../../../../core/models/produit.model';
import { Categorie } from '../../../../core/models/categorie.model';
import { CategorieService } from '../../../../core/services/categorie.service';
import { BackendHealthService } from '../../../../core/services/backend-health.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, RouterLink, LoadingComponent, SearchBarComponent, FilterChipsComponent, ProductCardComponent, EmptyStateComponent],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  page = 0;
  totalPages = 0;
  totalElements = 0;
  chargement = true;
  erreur = '';
  messageChargement = 'Chargement des produits...';

  keyword = '';
  selectedCategorie = '';
  localite = '';
  prixMin?: number;
  prixMax?: number;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private backendHealth: BackendHealthService
  ) {}

  ngOnInit() {
    this.backendHealth.waitForBackend(2000, 15).pipe(
      switchMap((ready) => {
        if (!ready) {
          this.chargement = false;
          this.erreur = 'Serveur non disponible.';
          return of(null);
        }
        return this.categorieService.getAll();
      })
    ).pipe(retry(2)).subscribe({
      next: data => {
        if (data) {
          this.categories = data;
          this.route.queryParams.subscribe(params => {
            const catId = params['categorieId'];
            if (catId && this.categories.some(c => c.id === catId)) {
              this.selectedCategorie = catId;
            }
            this.search();
          });
        }
      },
      error: () => { this.chargement = false; this.erreur = 'Serveur non disponible.'; }
    });
  }

  reessayer() {
    this.chargement = true;
    this.erreur = '';
    this.ngOnInit();
  }

  search() {
    this.chargement = true;
    this.erreur = '';
    const params: ProduitSearchParams = { page: this.page, size: 20 };
    if (this.keyword) params.keyword = this.keyword;
    if (this.selectedCategorie) params.categorieId = this.selectedCategorie;
    if (this.localite) params.localite = this.localite;
    if (this.prixMin) params.prixMin = this.prixMin;
    if (this.prixMax) params.prixMax = this.prixMax;

    this.produitService.search(params).pipe(retry(3)).subscribe({
      next: (res: PageResponse<Produit>) => {
        this.produits = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.chargement = false;
      },
      error: () => { this.chargement = false; this.erreur = 'Impossible de charger les produits. Réessayez.'; }
    });
  }

  onSearch() {
    this.page = 0;
    this.search();
  }

  prevPage() {
    if (this.page > 0) { this.page--; this.search(); }
  }

  nextPage() {
    if (this.page < this.totalPages - 1) { this.page++; this.search(); }
  }

  resetFilters() {
    this.keyword = '';
    this.selectedCategorie = '';
    this.localite = '';
    this.prixMin = undefined;
    this.prixMax = undefined;
    this.onSearch();
  }

  get hasFilters(): boolean {
    return !!(this.keyword || this.selectedCategorie || this.localite || this.prixMin || this.prixMax);
  }

  get categoryChips(): FilterChip[] {
    return [
      { value: '', label: 'Tout' },
      ...this.categories.map(c => ({ value: c.id, label: c.nom }))
    ];
  }

  private imageMap: Record<string, string> = {
    'banane': 'assets/product-banana.jpg',
    'igname': 'assets/product-igname.jpg',
    'tomate': 'assets/product-tomate.jpg',
    'poulet': 'assets/product-poulet.jpg',
    'huile': 'assets/product-huile.jpg',
    'miel': 'assets/product-miel.jpg',
    'manioc': 'assets/product-manioc.jpg',
    'piment': 'assets/product-piment.jpg',
    'maïs': 'assets/product-mais.jpg',
    'attiéké': 'assets/product-attieke.jpg',
    'oeuf': 'assets/product-oeuf.jpg',
    'œuf': 'assets/product-oeuf.jpg',
    'gingembre': 'assets/product-gingembre.jpg',
    'bissap': 'assets/product-jus.jpg',
    'aubergine': 'assets/product-aubergine.jpg',
    'cajou': 'assets/product-cajou.jpg',
    'noix': 'assets/product-cajou.jpg',
    'riz': 'assets/product-riz.jpg',
    'orange': 'assets/product-orange.jpg',
    'avocat': 'assets/product-avocat.jpg',
    'blé': 'assets/product-ble.jpg',
    'ble': 'assets/product-ble.jpg'
  };

  private fallbackImages = [
    'assets/product-banana.jpg',
    'assets/product-mais.jpg',
    'assets/product-tomate.jpg',
    'assets/product-igname.jpg',
    'assets/product-miel.jpg',
    'assets/product-poulet.jpg'
  ];

  getProductImage(produit: Produit): string {
    if (produit?.photos?.length) return produit.photos[0];
    const lower = produit?.titre?.toLowerCase() || '';
    for (const [key, img] of Object.entries(this.imageMap)) {
      if (lower.includes(key)) return img;
    }
    const hash = produit?.titre ? produit.titre.charCodeAt(0) : 0;
    return this.fallbackImages[hash % this.fallbackImages.length];
  }
}
