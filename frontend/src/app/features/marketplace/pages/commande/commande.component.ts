import { Component } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PanierService } from '../../../../core/services/panier.service';
import { CommandeService } from '../../../../core/services/commande.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent {
  items: any[] = [];
  avecLivraison = false;
  adresseLivraison = '';
  notes = '';
  enCours = false;
  success = false;

  constructor(
    private panierService: PanierService,
    private commandeService: CommandeService,
    private router: Router
  ) {
    this.items = this.panierService.getSnapshot();
  }

  get total(): number {
    return this.items.reduce((s, i) => s + i.produit.prix * i.quantite, 0);
  }

  confirmer() {
    if (this.enCours || !this.items.length) return;
    this.enCours = true;

    const lignes = this.items.map(i => ({
      produitId: i.produit.id,
      quantite: i.quantite
    }));

    const data: any = { lignes };
    if (this.avecLivraison) {
      data.avecLivraison = true;
      data.adresseLivraison = this.adresseLivraison;
    }
    if (this.notes) data.notes = this.notes;

    this.commandeService.create(data).subscribe({
      next: () => {
        this.success = true;
        this.panierService.clear();
        setTimeout(() => this.router.navigate(['/produits']), 2000);
      },
      error: () => {
        this.enCours = false;
        alert('Erreur lors de la création de la commande.');
      }
    });
  }
}
