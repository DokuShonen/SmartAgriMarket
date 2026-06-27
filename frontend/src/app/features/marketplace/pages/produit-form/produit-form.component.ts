import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../../../core/models/categorie.model';
import { CategorieService } from '../../../../core/services/categorie.service';
import { ProduitService } from '../../../../core/services/produit.service';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, FormsModule],
  templateUrl: './produit-form.component.html',
  styleUrls: ['./produit-form.component.css']
})
export class ProduitFormComponent implements OnInit {
  editionId: string | null = null;
  categories: Categorie[] = [];
  titre = '';
  description = '';
  prix = 0;
  uniteVente = '';
  quantiteDisponible = 1;
  categorieId = '';
  localite = '';
  conditionsLivraison = '';
  enCours = false;

  constructor(
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categorieService.getAll().subscribe(data => this.categories = data);

    this.editionId = this.route.snapshot.paramMap.get('id');
    if (this.editionId) {
      this.produitService.getById(this.editionId).subscribe(p => {
        this.titre = p.titre;
        this.description = p.description;
        this.prix = p.prix;
        this.uniteVente = p.uniteVente;
        this.quantiteDisponible = p.quantiteDisponible;
        this.localite = p.localite;
        this.conditionsLivraison = p.conditionsLivraison;
      });
    }
  }

  submit() {
    if (this.enCours) return;
    this.enCours = true;

    const data = {
      titre: this.titre,
      description: this.description,
      prix: this.prix,
      uniteVente: this.uniteVente,
      quantiteDisponible: this.quantiteDisponible,
      categorieId: this.categorieId,
      localite: this.localite,
      conditionsLivraison: this.conditionsLivraison
    };

    const request = this.editionId
      ? this.produitService.update(this.editionId, data)
      : this.produitService.create(data);

    request.subscribe({
      next: () => this.router.navigate(['/produits/dashboard']),
      error: () => { this.enCours = false; alert('Erreur lors de l\'enregistrement.'); }
    });
  }
}
