import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { UtilisateurService } from '../../../../core/services/utilisateur.service';
import { Utilisateur } from '../../../../core/models/utilisateur.model';

@Component({
  selector: 'app-agent-relais-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  template: `
    <div class="dashboard-container">
      <h2>Tableau de bord Agent Relais</h2>
      <p class="sub">Gestion des vérifications producteurs — {{ auth.utilisateur()?.localite }}</p>

      <div class="stats-grid">
        <div class="stat-card">
          <span class="material-icons-outlined stat-icon">people</span>
          <div class="stat-value">{{ producteurs.length }}</div>
          <div class="stat-label">Producteurs total</div>
        </div>
        <div class="stat-card">
          <span class="material-icons-outlined stat-icon">verified</span>
          <div class="stat-value">{{ verifieCount }}</div>
          <div class="stat-label">Vérifiés</div>
        </div>
        <div class="stat-card">
          <span class="material-icons-outlined stat-icon">pending</span>
          <div class="stat-value">{{ producteurs.length - verifieCount }}</div>
          <div class="stat-label">En attente</div>
        </div>
      </div>

      <h3 style="font-size:1rem;margin-bottom:0.75rem">Producteurs de ma zone</h3>

      <div *ngIf="loading" class="empty">Chargement...</div>
      <div *ngIf="!loading && !producteurs.length" class="empty">Aucun producteur dans votre zone.</div>

      <table *ngIf="producteurs.length">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Localité</th>
            <th>Inscrit le</th>
            <th>Statut</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let u of producteurs">
            <td>{{ u.prenom }} {{ u.nom }}</td>
            <td>{{ u.email }}</td>
            <td>{{ u.localite }}</td>
            <td>{{ u.dateInscription | date:'dd/MM/yyyy' }}</td>
            <td>
              <span class="badge" [class.ok]="u.estVerifie" [class.non]="!u.estVerifie">
                {{ u.estVerifie ? 'Vérifié' : 'Non vérifié' }}
              </span>
            </td>
            <td>
              <button class="btn btn-verify" *ngIf="!u.estVerifie" (click)="verifier(u.id)">
                <span class="material-icons-outlined" style="font-size:14px">check_circle</span> Vérifier
              </button>
              <span *ngIf="u.estVerifie" class="badge ok" style="font-size:0.75rem">✓</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 960px; margin: 0 auto; padding: 1.5rem 1rem; }
    h2 { font-size: 1.4rem; margin-bottom: 0.25rem; }
    .sub { color: #888; font-size: 0.85rem; margin-bottom: 1.25rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
    .stat-card { background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 1.25rem; text-align: center; }
    .stat-card .stat-value { font-size: 1.8rem; font-weight: 700; color: #1a5c2a; }
    .stat-card .stat-label { font-size: 0.78rem; color: #888; margin-top: 0.25rem; }
    .stat-card .stat-icon { font-size: 1.5rem; color: #1a5c2a; margin-bottom: 0.25rem; display: block; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
    th { background: #1a5c2a; color: #fff; padding: 0.6rem 0.8rem; text-align: left; font-size: 0.85rem; }
    td { padding: 0.6rem 0.8rem; border-bottom: 1px solid #eee; font-size: 0.85rem; }
    .badge { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .badge.ok { background: #e8f5e9; color: #2e7d32; }
    .badge.non { background: #ffebee; color: #c62828; }
    .btn { padding: 0.35rem 0.8rem; border: none; border-radius: 5px; font-size: 0.8rem; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; }
    .btn-verify { background: #e8f5e9; color: #2e7d32; }
    .btn-verify:active { background: #c8e6c9; }
    .empty { text-align: center; padding: 3rem; color: #888; }
  `]
})
export class AgentRelaisDashboardComponent implements OnInit {
  producteurs: Utilisateur[] = [];
  loading = true;

  constructor(
    public auth: AuthService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.utilisateurService.getAll().subscribe(data => {
      this.producteurs = data.filter(u => u.type === 'PRODUCTEUR');
      this.loading = false;
    });
  }

  get verifieCount(): number {
    return this.producteurs.filter(u => u.estVerifie).length;
  }

  verifier(id: string) {
    this.utilisateurService.toggleVerification(id).subscribe(() => {
      this.utilisateurService.getAll().subscribe(data => {
        this.producteurs = data.filter(u => u.type === 'PRODUCTEUR');
      });
    });
  }
}
