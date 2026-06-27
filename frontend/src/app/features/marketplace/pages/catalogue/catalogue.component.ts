import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProduitService, PageResponse, ProduitSearchParams } from '../../../../core/services/produit.service';
import { Produit } from '../../../../core/models/produit.model';
import { Categorie } from '../../../../core/models/categorie.model';
import { CategorieService } from '../../../../core/services/categorie.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  produits: Produit[] = [];
  categories: Categorie[] = [];
  page = 0;
  totalPages = 0;
  totalElements = 0;

  keyword = '';
  selectedCategorie = '';
  localite = '';
  prixMin?: number;
  prixMax?: number;

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService
  ) {}

  ngOnInit() {
    this.categorieService.getAll().subscribe(data => this.categories = data);
    this.search();
  }

  search() {
    const params: ProduitSearchParams = { page: this.page, size: 20 };
    if (this.keyword) params.keyword = this.keyword;
    if (this.selectedCategorie) params.categorieId = this.selectedCategorie;
    if (this.localite) params.localite = this.localite;
    if (this.prixMin) params.prixMin = this.prixMin;
    if (this.prixMax) params.prixMax = this.prixMax;

    this.produitService.search(params).subscribe((res: PageResponse<Produit>) => {
      this.produits = res.content;
      this.totalPages = res.totalPages;
      this.totalElements = res.totalElements;
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
}
