import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LogistiqueService } from '../../../../core/services/logistique.service';
import { AuthService } from '../../../../core/services/auth.service';
import { DemandeLivraison } from '../../../../core/models/livraison.model';

@Component({
  selector: 'app-logistique-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink],
  template: `
    <div class="log-dashboard">
      <h2>Tableau de bord logistique</h2>
      <p class="sub">Gérez les livraisons et suivez les colis</p>

      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ demandesEnAttente.length }}</span>
          <span class="stat-label">En attente</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ mesLivraisons.length }}</span>
          <span class="stat-label">Mes livraisons</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ livrees }}</span>
          <span class="stat-label">Livrées</span>
        </div>
      </div>

      <!-- Demandes en attente (à prendre en charge) -->
      <section class="section" *ngIf="demandesEnAttente.length">
        <h3>Demandes en attente</h3>
        <div *ngFor="let d of demandesEnAttente" class="card">
          <div class="card-row">
            <div class="adresse">
              <span class="label">Départ</span>
              <p>{{ d.adresseDepart }}</p>
            </div>
            <span class="arrow"><span class="material-icons-outlined">arrow_forward</span></span>
            <div class="adresse">
              <span class="label">Arrivée</span>
              <p>{{ d.adresseArrivee }}</p>
            </div>
          </div>
          <div class="card-footer">
            <span class="badge attente">En attente</span>
            <span class="frais" *ngIf="d.frais">{{ d.frais | number }} FCFA</span>
            <button class="btn btn-take" (click)="prendreEnCharge(d.id)">Prendre en charge</button>
          </div>
        </div>
      </section>

      <!-- Mes livraisons assignées -->
      <section class="section">
        <h3>Mes livraisons assignées</h3>
        <div *ngIf="mesLivraisons.length; else empty">
          <div *ngFor="let d of mesLivraisons" class="card">
            <div class="card-row">
              <div class="adresse">
                <span class="label">Départ</span>
                <p>{{ d.adresseDepart }}</p>
              </div>
              <span class="arrow"><span class="material-icons-outlined">arrow_forward</span></span>
              <div class="adresse">
                <span class="label">Arrivée</span>
                <p>{{ d.adresseArrivee }}</p>
              </div>
            </div>
            <div class="card-footer">
              <span class="badge" [class]="badgeClass(d.statut)">{{ statutLabel(d.statut) }}</span>
              <span class="frais" *ngIf="d.frais">{{ d.frais | number }} FCFA</span>
              <div class="action-btns">
                <a [routerLink]="'/logistique/' + d.id" class="btn btn-detail">Voir suivi</a>
                <button *ngIf="d.statut === 'EN_COURS'" class="btn btn-deliver" (click)="confirmerLivraison(d.id)">
                  Confirmer livraison
                </button>
              </div>
            </div>
          </div>
        </div>
        <ng-template #empty>
          <div class="empty">Aucune livraison assignée.</div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .log-dashboard { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem; }
    h2 { font-size: 1.4rem; margin-bottom: 0.25rem; }
    h3 { font-size: 1.1rem; margin-bottom: 0.75rem; color: #333; }
    .sub { color: #888; font-size: 0.85rem; margin-bottom: 1.25rem; }
    .stats-row { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { flex: 1; background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 1rem; text-align: center; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #1a5c2a; }
    .stat-label { font-size: 0.8rem; color: #888; }
    .section { margin-bottom: 2rem; }
    .card { background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem; }
    .card-row { display: flex; align-items: center; gap: 1rem; }
    .adresse { flex: 1; }
    .label { font-size: 0.75rem; color: #888; text-transform: uppercase; }
    .adresse p { font-weight: 600; font-size: 0.9rem; }
    .arrow { font-size: 1.2rem; color: #1a5c2a; }
    .card-footer { display: flex; align-items: center; gap: 0.75rem; margin-top: 0.75rem; flex-wrap: wrap; }
    .badge { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .badge.attente { background: #fff3e0; color: #e65100; }
    .badge.encours { background: #e3f2fd; color: #1565c0; }
    .badge.livree { background: #e8f5e9; color: #2e7d32; }
    .frais { font-size: 0.85rem; font-weight: 600; color: #1a5c2a; }
    .action-btns { display: flex; gap: 0.5rem; margin-left: auto; }
    .btn { padding: 0.4rem 0.8rem; border: none; border-radius: 6px; font-size: 0.8rem; font-weight: 600; cursor: pointer; text-decoration: none; }
    .btn-take { background: #1a5c2a; color: #fff; }
    .btn-take:hover { background: #2e7d32; }
    .btn-deliver { background: #e8f5e9; color: #2e7d32; }
    .btn-detail { background: #e3f2fd; color: #1565c0; }
    .empty { text-align: center; padding: 2rem; color: #888; }
  `]
})
export class LogistiqueDashboardComponent implements OnInit {
  demandesEnAttente: DemandeLivraison[] = [];
  mesLivraisons: DemandeLivraison[] = [];

  constructor(
    private logistiqueService: LogistiqueService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.logistiqueService.getDemandesEnAttente().subscribe(data => this.demandesEnAttente = data);
    this.logistiqueService.getMesLivraisons().subscribe(data => this.mesLivraisons = data);
  }

  get livrees(): number {
    return this.mesLivraisons.filter(d => d.statut === 'LIVREE').length;
  }

  statutLabel(s: string): string {
    const map: Record<string,string> = {
      'EN_ATTENTE': 'En attente', 'EN_COURS': 'En cours', 'LIVREE': 'Livrée'
    };
    return map[s] || s;
  }

  badgeClass(s: string): string {
    const map: Record<string,string> = {
      'EN_ATTENTE': 'attente', 'EN_COURS': 'encours', 'LIVREE': 'livree'
    };
    return map[s] || '';
  }

  prendreEnCharge(id: string) {
    this.logistiqueService.prendreEnCharge(id).subscribe(() => this.load());
  }

  confirmerLivraison(id: string) {
    this.logistiqueService.confirmerLivraison(id).subscribe(() => this.load());
  }
}
