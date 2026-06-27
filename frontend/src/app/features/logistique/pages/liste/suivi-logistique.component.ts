import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DemandeLivraison } from '../../../../core/models/livraison.model';

@Component({
  selector: 'app-suivi-logistique',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './suivi-logistique.component.html',
  styleUrls: ['./suivi-logistique.component.css']
})
export class SuiviLogistiqueComponent implements OnInit {
  demandes: DemandeLivraison[] = [];

  ngOnInit() {
    // TODO: connect to backend when LivraisonController exposes list by user
    // this.logistiqueService.getMesDemandes().subscribe(data => this.demandes = data);
  }

  badgeClass(statut: string): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'attente',
      'PRISE_EN_CHARGE': 'encours',
      'EN_COURS': 'encours',
      'LIVREE': 'livree',
      'ANNULEE': 'annulee'
    };
    return map[statut] || '';
  }

  statutLabel(statut: string): string {
    const map: Record<string, string> = {
      'EN_ATTENTE': 'En attente',
      'PRISE_EN_CHARGE': 'Prise en charge',
      'EN_COURS': 'En cours',
      'LIVREE': 'Livrée',
      'ANNULEE': 'Annulée'
    };
    return map[statut] || statut;
  }
}
