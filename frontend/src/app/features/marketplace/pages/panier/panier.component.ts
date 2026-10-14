import { Component, OnInit } from '@angular/core';
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
export class PanierComponent implements OnInit {
  items: PanierItem[] = [];

  constructor(private panierService: PanierService) {}

  ngOnInit() {
    this.items = this.panierService.getSnapshot();
    this.panierService.getItems().subscribe(items => {
      this.items = items;
    });
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

  get totalItems(): number {
    return this.items.reduce((s, i) => s + i.quantite, 0);
  }
}
