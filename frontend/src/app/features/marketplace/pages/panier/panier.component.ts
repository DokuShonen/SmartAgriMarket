import { Component } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PanierItem, PanierService } from '../../../../core/services/panier.service';

@Component({
  selector: 'app-panier',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink],
  templateUrl: './panier.component.html',
  styleUrls: ['./panier.component.css']
})
export class PanierComponent {
  items: PanierItem[] = [];

  constructor(private panierService: PanierService) {
    this.panierService.getItems().subscribe(items => this.items = items);
  }

  updateQte(produitId: string, qte: number) {
    this.panierService.updateQuantite(produitId, qte);
  }

  retirer(produitId: string) {
    this.panierService.remove(produitId);
  }

  get total(): number {
    return this.items.reduce((s, i) => s + i.produit.prix * i.quantite, 0);
  }
}
