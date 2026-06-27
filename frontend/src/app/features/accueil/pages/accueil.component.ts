import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Produit } from '../../../core/models/produit.model';
import { Categorie } from '../../../core/models/categorie.model';
import { CoursSemence } from '../../../core/models/cours-semence.model';
import { ProduitVedette } from '../../../core/models/produit-vedette.model';
import { ProduitService, PageResponse } from '../../../core/services/produit.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { CoursSemenceService } from '../../../core/services/cours-semence.service';
import { ProduitVedetteService } from '../../../core/services/produit-vedette.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit {
  categories: Categorie[] = [];
  produitsVedettes: ProduitVedette[] = [];
  coursSemences: CoursSemence[] = [];
  derniersProduits: Produit[] = [];
  searchQuery = '';
  semenceFilter = '';

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private coursSemenceService: CoursSemenceService,
    private produitVedetteService: ProduitVedetteService
  ) {}

  ngOnInit() {
    this.categorieService.getAll().subscribe(data => this.categories = data);
    this.produitVedetteService.getActifs().subscribe(data => this.produitsVedettes = data);
    this.coursSemenceService.getAll().subscribe(data => this.coursSemences = data);
    this.produitService.search({ page: 0, size: 8 }).subscribe((res: PageResponse<Produit>) => {
      this.derniersProduits = res.content.reverse();
    });
  }

  get filteredSemences(): CoursSemence[] {
    if (!this.semenceFilter) return this.coursSemences;
    return this.coursSemences.filter(s =>
      s.localite.toLowerCase().includes(this.semenceFilter.toLowerCase())
    );
  }

  get uniqueLocalites(): string[] {
    return [...new Set(this.coursSemences.map(s => s.localite))];
  }

  onSearch() {} // handled by routerLink on the button
}
