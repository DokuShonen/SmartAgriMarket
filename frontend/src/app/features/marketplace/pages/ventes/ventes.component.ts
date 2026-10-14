import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Commande } from '../../../../core/models/commande.model';
import { CommandeService } from '../../../../core/services/commande.service';
import { SuiviColisComponent } from '../../../../shared/components/suivi-colis.component';

@Component({
  selector: 'app-ventes',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, SlicePipe, FormsModule, SuiviColisComponent],
  template: `
    <div class="ventes-container container">
      <div class="ventes-header">
        <h1>Mes ventes</h1>
        <p class="sub">Gérez les commandes reçues</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <span class="material-icons-outlined">shopping_bag</span>
          <div><span class="stat-value">{{ totalVentes }}</span><span class="stat-label">Commandes</span></div>
        </div>
        <div class="stat-card">
          <span class="material-icons-outlined">payments</span>
          <div><span class="stat-value">{{ montantTotal | number }} FCFA</span><span class="stat-label">Chiffre d'affaires</span></div>
        </div>
        <div class="stat-card">
          <span class="material-icons-outlined">schedule</span>
          <div><span class="stat-value">{{ enAttente }}</span><span class="stat-label">En attente</span></div>
        </div>
      </div>

      <div class="filter-tabs" role="tablist" aria-label="Filtrer par statut">
        <button role="tab" [attr.aria-selected]="filtre === ''" [class.active]="filtre === ''" (click)="filtre = ''">Toutes</button>
        <button role="tab" [attr.aria-selected]="filtre === 'EN_ATTENTE'" [class.active]="filtre === 'EN_ATTENTE'" (click)="filtre = 'EN_ATTENTE'">En attente</button>
        <button role="tab" [attr.aria-selected]="filtre === 'CONFIRMEE'" [class.active]="filtre === 'CONFIRMEE'" (click)="filtre = 'CONFIRMEE'">Confirmées</button>
        <button role="tab" [attr.aria-selected]="filtre === 'EN_PREPARATION'" [class.active]="filtre === 'EN_PREPARATION'" (click)="filtre = 'EN_PREPARATION'">Préparation</button>
        <button role="tab" [attr.aria-selected]="filtre === 'EN_COURS_LIVRAISON'" [class.active]="filtre === 'EN_COURS_LIVRAISON'" (click)="filtre = 'EN_COURS_LIVRAISON'">Livraison</button>
        <button role="tab" [attr.aria-selected]="filtre === 'LIVREE'" [class.active]="filtre === 'LIVREE'" (click)="filtre = 'LIVREE'">Livrées</button>
        <button role="tab" [attr.aria-selected]="filtre === 'ANNULEE'" [class.active]="filtre === 'ANNULEE'" (click)="filtre = 'ANNULEE'">Annulées</button>
      </div>

      <div *ngIf="filtered.length; else empty">
        <div *ngFor="let c of filtered" class="order-card stagger-item">
          <div class="order-header">
            <span class="order-id">#{{ c.id | slice:0:8 }}</span>
            <span class="badge" [class]="badgeClass(c.statut)">{{ statutLabel(c.statut) }}</span>
          </div>
          <div class="order-buyer">
            <span class="material-icons-outlined">person</span> {{ c.acheteurNom }}
          </div>
          <div class="order-items">
            <div *ngFor="let l of c.lignes" class="order-item">
              <span>{{ l.produitTitre }} × {{ l.quantite }}</span>
              <span class="order-item-price">{{ (l.prixUnitaire * l.quantite) | number }} FCFA</span>
            </div>
          </div>
          <div class="order-footer">
            <div class="order-total">
              <strong>Total : {{ c.montantTotal | number }} FCFA</strong>
              <span class="order-date">{{ c.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <div class="order-address" *ngIf="c.adresseLivraison">
              <span class="material-icons-outlined">location_on</span> {{ c.adresseLivraison }}
            </div>
            <div class="order-notes" *ngIf="c.notes">
              <span class="material-icons-outlined">sticky_note_2</span> {{ c.notes }}
            </div>
            <!-- DELIVERY TRACKING (producteur) -->
            <app-suivi-colis *ngIf="c.statut === 'EN_COURS_LIVRAISON' || c.statut === 'LIVREE'"
              [commandeId]="c.id"></app-suivi-colis>
            <div class="actions">
              <button *ngIf="c.statut === 'EN_ATTENTE'" class="btn-action btn-confirm" (click)="confirmer(c.id)">
                <span class="material-icons-outlined">check</span> Confirmer
              </button>
              <button *ngIf="c.statut === 'CONFIRMEE'" class="btn-action btn-prepare" (click)="preparer(c.id)">
                <span class="material-icons-outlined">inventory</span> Préparer
              </button>
              <button *ngIf="c.statut === 'EN_PREPARATION'" class="btn-action btn-ship" (click)="expedier(c.id)">
                <span class="material-icons-outlined">local_shipping</span> Envoyer
              </button>
              <button *ngIf="c.statut === 'EN_ATTENTE'" class="btn-action btn-cancel" (click)="annuler(c.id)">
                <span class="material-icons-outlined">close</span> Refuser
              </button>
            </div>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <span class="material-icons-outlined">receipt_long</span>
          <h3>Aucune vente</h3>
          <p>Les commandes reçues apparaîtront ici</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .ventes-container { padding-top: 2rem; padding-bottom: 3rem; }
    .ventes-header { margin-bottom: 2rem; }
    .ventes-header h1 { font-family: var(--font-display); font-size: 1.8rem; }
    .ventes-header .sub { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.2rem; }

    .stats-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { display: flex; align-items: center; gap: 0.75rem; background: #fff; border: 1px solid var(--n-100); border-radius: var(--radius-sm); padding: 1rem 1.25rem; flex: 1; }
    .stat-card .material-icons-outlined { font-size: 1.5rem; color: var(--g-600); }
    .stat-value { display: block; font-size: 1.1rem; font-weight: 700; color: var(--dark); }
    .stat-label { font-size: 0.78rem; color: var(--text-secondary); }

    .filter-tabs { display: flex; gap: 0.4rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filter-tabs button { padding: 0.4rem 0.9rem; border: 1px solid var(--n-200); background: #fff; border-radius: var(--radius-sm); font-size: 0.8rem; cursor: pointer; transition: all 0.2s; color: var(--text-secondary); }
    .filter-tabs button.active { background: var(--g-700); color: #fff; border-color: var(--g-700); }
    .filter-tabs button:hover:not(.active) { border-color: var(--g-300); }

    .order-card { background: #fff; border: 1px solid var(--n-100); border-radius: var(--radius); padding: 1.25rem; margin-bottom: 0.75rem; transition: box-shadow 0.2s; }
    .order-card:hover { box-shadow: var(--shadow-card); }
    .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .order-id { font-weight: 700; font-size: 0.9rem; color: var(--text); }
    .badge { padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 600; }
    .badge.attente { background: #fef3c7; color: #b45309; }
    .badge.confirmee { background: #dbeafe; color: #1d4ed8; }
    .badge.preparation { background: #f3e8ff; color: #7c3aed; }
    .badge.livraison { background: #d1fae5; color: #059669; }
    .badge.livree { background: #d1fae5; color: #059669; }
    .badge.annulee { background: #fee2e2; color: #dc2626; }

    .order-buyer { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem; }
    .order-buyer .material-icons-outlined { font-size: 0.95rem; color: var(--g-600); }

    .order-items { border-top: 1px solid var(--n-100); padding-top: 0.5rem; margin-bottom: 0.5rem; }
    .order-item { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.25rem 0; color: var(--text); }
    .order-item-price { font-weight: 600; }

    .order-footer { border-top: 1px solid var(--n-100); padding-top: 0.75rem; }
    .order-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .order-total strong { font-size: 1rem; color: var(--g-700); }
    .order-date { font-size: 0.78rem; color: var(--text-secondary); }
    .order-address, .order-notes { font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.3rem; }
    .order-address .material-icons-outlined, .order-notes .material-icons-outlined { font-size: 0.9rem; color: var(--g-500); }

    .actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
    .btn-action { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.45rem 0.9rem; border: none; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-action .material-icons-outlined { font-size: 0.9rem; }
    .btn-confirm { background: #d1fae5; color: #059669; }
    .btn-confirm:hover { background: #a7f3d0; }
    .btn-prepare { background: #f3e8ff; color: #7c3aed; }
    .btn-prepare:hover { background: #e9d5ff; }
    .btn-ship { background: #dbeafe; color: #1d4ed8; }
    .btn-ship:hover { background: #bfdbfe; }
    .btn-cancel { background: #fee2e2; color: #dc2626; }
    .btn-cancel:hover { background: #fecaca; }

    .empty-state { text-align: center; padding: 4rem 2rem; background: #fff; border: 1px solid var(--n-100); border-radius: var(--radius); }
    .empty-state .material-icons-outlined { font-size: 3rem; color: var(--n-300); margin-bottom: 1rem; display: block; }
    .empty-state h3 { font-size: 1.1rem; color: var(--text); margin-bottom: 0.3rem; }
    .empty-state p { color: var(--text-secondary); font-size: 0.9rem; }

    @media (max-width: 768px) { .stats-row { flex-direction: column; } }
  `]
})
export class VentesComponent implements OnInit {
  commandes: Commande[] = [];
  filtre = '';

  constructor(private commandeService: CommandeService) {}

  ngOnInit() { this.commandeService.getVentes().subscribe(data => this.commandes = data); }

  get filtered(): Commande[] {
    if (!this.filtre) return this.commandes;
    return this.commandes.filter(c => c.statut === this.filtre);
  }

  get totalVentes(): number { return this.commandes.length; }
  get montantTotal(): number { return this.commandes.reduce((s, c) => s + c.montantTotal, 0); }
  get enAttente(): number { return this.commandes.filter(c => c.statut === 'EN_ATTENTE').length; }

  statutLabel(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE': 'En attente', 'CONFIRMEE': 'Confirmée', 'EN_PREPARATION': 'Préparation', 'EN_COURS_LIVRAISON': 'Livraison', 'LIVREE': 'Livrée', 'ANNULEE': 'Annulée' };
    return map[s] || s;
  }

  badgeClass(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE': 'attente', 'CONFIRMEE': 'confirmee', 'EN_PREPARATION': 'preparation', 'EN_COURS_LIVRAISON': 'livraison', 'LIVREE': 'livree', 'ANNULEE': 'annulee' };
    return map[s] || '';
  }

  confirmer(id: string) {
    this.commandeService.confirmerCommande(id).subscribe(() => {
      this.commandeService.getVentes().subscribe(data => this.commandes = data);
    });
  }

  preparer(id: string) {
    this.commandeService.preparer(id).subscribe(() => {
      this.commandeService.getVentes().subscribe(data => this.commandes = data);
    });
  }

  expedier(id: string) {
    this.commandeService.expedier(id).subscribe(() => {
      this.commandeService.getVentes().subscribe(data => this.commandes = data);
    });
  }

  annuler(id: string) {
    this.commandeService.updateStatut(id, 'ANNULEE').subscribe(() => {
      this.commandeService.getVentes().subscribe(data => this.commandes = data);
    });
  }
}
