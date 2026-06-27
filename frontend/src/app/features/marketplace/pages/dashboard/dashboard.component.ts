import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produit } from '../../../../core/models/produit.model';
import { ProduitService } from '../../../../core/services/produit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  produits: Produit[] = [];

  constructor(private produitService: ProduitService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.produitService.getByVendeur('me').subscribe(data => this.produits = data);
  }

  supprimer(id: string) {
    if (confirm('Supprimer cette annonce ?')) {
      this.produitService.delete(id).subscribe(() => this.load());
    }
  }
}
