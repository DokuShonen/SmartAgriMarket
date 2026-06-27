import { Component, OnInit } from '@angular/core';
import { NgIf, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Produit } from '../../../../core/models/produit.model';
import { ProduitService } from '../../../../core/services/produit.service';
import { PanierService } from '../../../../core/services/panier.service';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [NgIf, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  produit?: Produit;
  quantite = 1;
  ajouteAuPanier = false;

  constructor(
    private route: ActivatedRoute,
    private produitService: ProduitService,
    private panierService: PanierService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.produitService.getById(id).subscribe(data => this.produit = data);
  }

  ajouterAuPanier() {
    if (!this.produit) return;
    this.panierService.add(this.produit, this.quantite);
    this.ajouteAuPanier = true;
    setTimeout(() => this.ajouteAuPanier = false, 2000);
  }

  decrementer() { if (this.quantite > 1) this.quantite--; }

  incrementer() {
    if (this.produit && this.quantite < this.produit.quantiteDisponible) this.quantite++;
  }
}
