import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Commande } from '../../../../core/models/commande.model';
import { CommandeService } from '../../../../core/services/commande.service';
import { EvaluationService } from '../../../../core/services/evaluation.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SuiviColisComponent } from '../../../../shared/components/suivi-colis.component';

@Component({
  selector: 'app-historique-commandes',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, SlicePipe, RouterLink, FormsModule, SuiviColisComponent],
  template: `
    <div class="orders-page">
      <div class="page-header">
        <h1>Mes commandes</h1>
      </div>

      <!-- STATS -->
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-value">{{ totalCommandes }}</span>
          <span class="stat-label">Commandes</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ montantTotal | number }}</span>
          <span class="stat-label">FCFA dépensés</span>
        </div>
        <div class="stat-card accent">
          <span class="stat-value">{{ enCours }}</span>
          <span class="stat-label">En cours</span>
        </div>
      </div>

      <!-- FILTER CHIPS -->
      <div class="filter-chips">
        <button class="chip" [class.active]="filtre === ''" (click)="filtre = ''">Toutes</button>
        <button class="chip" [class.active]="filtre === 'EN_ATTENTE'" (click)="filtre = 'EN_ATTENTE'">En attente</button>
        <button class="chip" [class.active]="filtre === 'CONFIRMEE'" (click)="filtre = 'CONFIRMEE'">Confirmées</button>
        <button class="chip" [class.active]="filtre === 'EN_PREPARATION'" (click)="filtre = 'EN_PREPARATION'">Préparation</button>
        <button class="chip" [class.active]="filtre === 'EN_COURS_LIVRAISON'" (click)="filtre = 'EN_COURS_LIVRAISON'">Livraison</button>
        <button class="chip" [class.active]="filtre === 'LIVREE'" (click)="filtre = 'LIVREE'">Livrées</button>
        <button class="chip" [class.active]="filtre === 'ANNULEE'" (click)="filtre = 'ANNULEE'">Annulées</button>
      </div>

      <!-- ORDER LIST -->
      <div *ngIf="filtered.length; else empty" class="order-list">
        <div *ngFor="let c of filtered" class="order-card">
          <div class="order-top">
            <div class="order-id-row">
              <span class="order-id">#{{ c.id | slice:0:8 }}</span>
              <span class="badge" [class]="badgeClass(c.statut)">{{ statutLabel(c.statut) }}</span>
            </div>
            <span class="order-date">{{ c.dateCreation | date:'dd/MM/yyyy' }}</span>
          </div>

          <div class="order-seller">
            <span class="material-icons-outlined">store</span> {{ c.producteurNom }}
          </div>

          <div class="order-lines">
            <div *ngFor="let l of c.lignes" class="order-line">
              <span class="line-name">{{ l.produitTitre }}</span>
              <span class="line-qty">×{{ l.quantite }}</span>
              <span class="line-price">{{ (l.prixUnitaire * l.quantite) | number }} FCFA</span>
            </div>
          </div>

          <div class="order-summary">
            <div class="summary-row">
              <span>Total</span>
              <strong>{{ c.montantTotal | number }} FCFA</strong>
            </div>
            <div class="summary-row" *ngIf="c.fraisLivraison">
              <span>Frais livraison</span>
              <span>{{ c.fraisLivraison | number }} FCFA</span>
            </div>
            <div class="summary-row" *ngIf="c.adresseLivraison">
              <span class="material-icons-outlined">location_on</span>
              <span>{{ c.adresseLivraison }}</span>
            </div>
          </div>

          <!-- PAYMENT STATUS -->
          <div class="payment-info" *ngIf="c.paiementStatut">
            <span class="payment-badge" [class.paid]="c.paiementStatut === 'PAYE'" [class.pending]="c.paiementStatut === 'EN_ATTENTE'">
              <span class="material-icons-outlined">{{ c.paiementStatut === 'PAYE' ? 'check_circle' : 'schedule' }}</span>
              {{ paiementLabel(c.paiementStatut) }}
            </span>
          </div>

          <!-- DELIVERY TRACKING (client) -->
          <app-suivi-colis *ngIf="c.statut === 'EN_COURS_LIVRAISON' || c.statut === 'LIVREE'"
            [commandeId]="c.id"></app-suivi-colis>

          <!-- CONFIRM RECEIPT (client) -->
          <div class="delivery-actions" *ngIf="c.statut === 'EN_COURS_LIVRAISON'">
            <button class="btn-receive" (click)="confirmerReception(c.id)" [disabled="receptionEnCours === c.id">
              <span class="material-icons-outlined">inventory_2</span>
              {{ receptionEnCours === c.id ? 'Confirmation...' : 'Confirmer la réception' }}
            </button>
          </div>

          <!-- PAYMENT ACTIONS -->
          <div class="payment-actions" *ngIf="c.statut === 'CONFIRMEE' && !c.paiementStatut">
            <p class="payment-hint">Commande confirmée. Choisissez votre paiement :</p>
            <button class="btn-pay pay-now" (click)="payer(c.id, 'PAIEMENT_DIRECT')" [disabled]="paiementEnCours === c.id">
              <span class="material-icons-outlined">smartphone</span>
              Payer maintenant
            </button>
            <button class="btn-pay pay-later" (click)="payer(c.id, 'PAIEMENT_LIVRAISON')" [disabled]="paiementEnCours === c.id">
              <span class="material-icons-outlined">local_shipping</span>
              Payer à la livraison
            </button>
          </div>

          <!-- RATING -->
          <div class="rating-section" *ngIf="c.statut === 'LIVREE'">
            <div *ngIf="!ratedSellers.has(c.producteurId) && !ratingFormVisible[c.id]">
              <button class="btn-rate" (click)="showRatingForm(c.id, c.producteurId)">
                <span class="material-icons-outlined">star_rate</span>
                Noter {{ c.producteurNom }}
              </button>
            </div>

            <div class="rating-form" *ngIf="ratingFormVisible[c.id]">
              <div class="rating-stars">
                <button *ngFor="let s of [1,2,3,4,5]" class="star-btn" [class.filled]="s <= ratingNotes[c.id]"
                  (click)="ratingNotes[c.id] = s">
                  {{ s <= ratingNotes[c.id] ? '★' : '☆' }}
                </button>
              </div>
              <textarea class="rating-comment" rows="2" placeholder="Commentaire (optionnel)"
                [ngModel]="ratingComments[c.id]" (ngModelChange)="ratingComments[c.id] = $event"
                maxlength="300"></textarea>
              <div class="rating-actions">
                <button class="btn-rate-submit" (click)="submitRating(c.id, c.producteurId)"
                  [disabled]="!ratingNotes[c.id] || ratingSubmitting[c.id]">
                  {{ ratingSubmitting[c.id] ? 'Envoi…' : 'Envoyer' }}
                </button>
                <button class="btn-rate-cancel" (click)="cancelRating(c.id)">Annuler</button>
              </div>
            </div>

            <div class="rating-thanks" *ngIf="ratedSellers.has(c.producteurId) && !ratingFormVisible[c.id]">
              <span class="material-icons-outlined">check_circle</span>
              Merci pour votre évaluation
            </div>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty-state">
          <span class="material-icons-outlined">receipt_long</span>
          <h3>Aucune commande</h3>
          <p>Vous n'avez pas encore passé de commande</p>
          <a routerLink="/produits" class="btn-browse">Parcourir les produits</a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-page { padding: 1rem; max-width: 640px; margin: 0 auto; }

    .page-header { margin-bottom: 16px; }
    .page-header h1 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--heading-color);
    }

    /* === STATS === */
    .stats-row { display: flex; gap: 8px; margin-bottom: 16px; }
    .stat-card {
      flex: 1;
      text-align: center;
      padding: 12px 8px;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 10px;
    }
    .stat-card.accent { background: var(--g-50); border-color: var(--g-100); }
    .stat-value {
      display: block;
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--heading-color);
    }
    .stat-card.accent .stat-value { color: var(--brand); }
    .stat-label { font-size: 11px; color: var(--text-dim); }

    /* === FILTER CHIPS === */
    .filter-chips {
      display: flex;
      gap: 6px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding: 2px 0;
      margin-bottom: 16px;
    }
    .filter-chips::-webkit-scrollbar { display: none; }
    .chip {
      flex-shrink: 0;
      padding: 6px 12px;
      border: 1px solid var(--n-200);
      border-radius: 16px;
      background: #fff;
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .chip.active { background: var(--brand); color: #fff; border-color: var(--brand); }
    .chip:active { transform: scale(0.96); }

    /* === ORDER LIST === */
    .order-list { display: flex; flex-direction: column; gap: 10px; }

    .order-card {
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 12px;
      padding: 14px;
    }

    .order-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }
    .order-id-row { display: flex; align-items: center; gap: 8px; }
    .order-id { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--heading-color); }
    .order-date { font-size: 12px; color: var(--text-dim); }

    .badge { padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
    .badge.attente { background: #fef3c7; color: #b45309; }
    .badge.confirmee { background: #dbeafe; color: #1d4ed8; }
    .badge.preparation { background: #f3e8ff; color: #7c3aed; }
    .badge.livraison { background: #d1fae5; color: #059669; }
    .badge.livree { background: #d1fae5; color: #059669; }
    .badge.annulee { background: #fee2e2; color: #dc2626; }

    .order-seller {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: var(--text-secondary);
      margin-bottom: 10px;
    }
    .order-seller .material-icons-outlined { font-size: 15px; color: var(--brand); }

    .order-lines {
      border-top: 1px solid var(--n-100);
      padding-top: 8px;
      margin-bottom: 8px;
    }
    .order-line {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      padding: 3px 0;
    }
    .line-name { flex: 1; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .line-qty { color: var(--text-dim); font-size: 12px; }
    .line-price { font-weight: 600; color: var(--heading-color); font-size: 13px; white-space: nowrap; }

    .order-summary {
      border-top: 1px solid var(--n-100);
      padding-top: 8px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: var(--text-secondary);
      padding: 2px 0;
    }
    .summary-row strong {
      font-family: var(--font-display);
      font-size: 15px;
      color: var(--brand);
    }
    .summary-row .material-icons-outlined { font-size: 14px; color: var(--brand); }

    /* === PAYMENT === */
    .payment-info { margin-top: 8px; }
    .payment-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }
    .payment-badge .material-icons-outlined { font-size: 15px; }
    .payment-badge.paid { background: var(--g-50); color: var(--brand); }
    .payment-badge.pending { background: #fef3c7; color: #b45309; }

    .payment-actions {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--n-100);
    }
    .payment-hint { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
    .btn-pay {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      border: none;
      border-radius: 8px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      margin-right: 6px;
      margin-bottom: 6px;
      min-height: 44px;
    }
    .btn-pay .material-icons-outlined { font-size: 16px; }
    .pay-now { background: var(--brand); color: #fff; }
    .pay-now:active { background: var(--brand-dark); }
    .pay-later { background: #fef3c7; color: #b45309; }
    .pay-later:active { background: #fde68a; }
    .btn-pay:disabled { opacity: 0.5; }

    /* === RATING === */
    .rating-section {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid var(--n-100);
    }
    .btn-rate {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      border: 1px solid var(--brand);
      border-radius: 8px;
      background: #fff;
      color: var(--brand);
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-height: 40px;
      transition: background 0.15s;
    }
    .btn-rate .material-icons-outlined { font-size: 16px; }
    .btn-rate:active { background: var(--g-50); }

    .rating-form {
      background: var(--g-50);
      border-radius: 10px;
      padding: 12px;
    }
    .rating-stars {
      display: flex;
      gap: 4px;
      margin-bottom: 8px;
    }
    .star-btn {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: var(--n-300);
      padding: 0 2px;
      line-height: 1;
      transition: color 0.1s, transform 0.1s;
    }
    .star-btn.filled { color: #f59e0b; }
    .star-btn:hover { transform: scale(1.15); }

    .rating-comment {
      width: 100%;
      border: 1px solid var(--n-200);
      border-radius: 8px;
      padding: 8px 10px;
      font-family: 'Fira Sans', sans-serif;
      font-size: 13px;
      resize: vertical;
      box-sizing: border-box;
      margin-bottom: 8px;
      outline: none;
    }
    .rating-comment:focus { border-color: var(--brand); }

    .rating-actions {
      display: flex;
      gap: 8px;
    }
    .btn-rate-submit {
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      background: var(--brand);
      color: #fff;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      min-height: 40px;
    }
    .btn-rate-submit:active { background: var(--brand-dark); }
    .btn-rate-submit:disabled { opacity: 0.5; }
    .btn-rate-cancel {
      padding: 8px 16px;
      border: 1px solid var(--n-200);
      border-radius: 8px;
      background: #fff;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      min-height: 40px;
    }
    .btn-rate-cancel:active { background: var(--n-100); }

    .rating-thanks {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--brand);
    }
    .rating-thanks .material-icons-outlined { font-size: 18px; }

    /* === DELIVERY ACTIONS === */
    .delivery-actions {
      margin-top: 10px;
    }
    .btn-receive {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      width: 100%;
      padding: 12px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      min-height: 48px;
      transition: background 0.2s;
    }
    .btn-receive:hover { background: var(--brand-dark); }
    .btn-receive:disabled { opacity: 0.6; cursor: default; }
    .btn-receive .material-icons-outlined { font-size: 18px; }

    /* === EMPTY === */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 12px;
    }
    .empty-state .material-icons-outlined { font-size: 3rem; color: var(--n-300); margin-bottom: 12px; display: block; }
    .empty-state h3 { font-family: var(--font-display); font-size: 1rem; color: var(--heading-color); margin-bottom: 4px; }
    .empty-state p { font-size: 13px; color: var(--text-secondary); margin-bottom: 16px; }
    .btn-browse {
      display: inline-flex;
      align-items: center;
      padding: 12px 24px;
      background: var(--brand);
      color: #fff;
      border-radius: 20px;
      text-decoration: none;
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      min-height: 48px;
    }

    @media (min-width: 769px) {
      .orders-page { padding: 2rem; }
      .page-header h1 { font-size: 1.8rem; }
    }
  `]
})
export class HistoriqueCommandesComponent implements OnInit {
  commandes: Commande[] = [];
  filtre = '';
  paiementEnCours = '';
  receptionEnCours = '';

  ratedSellers = new Set<string>();
  ratingFormVisible: Record<string, boolean> = {};
  ratingNotes: Record<string, number> = {};
  ratingComments: Record<string, string> = {};
  ratingSubmitting: Record<string, boolean> = {};

  constructor(
    private commandeService: CommandeService,
    private evaluationService: EvaluationService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.commandeService.getMesCommandes().subscribe(data => {
      this.commandes = data;
      this.loadRatedSellers();
    });
  }

  private loadRatedSellers() {
    const userId = this.authService.utilisateur()?.id;
    if (!userId) return;

    const producteurIds = [...new Set(
      this.commandes
        .filter(c => c.statut === 'LIVREE')
        .map(c => c.producteurId)
    )];

    if (!producteurIds.length) return;

    forkJoin(
      producteurIds.map(pid => this.evaluationService.getByReceveur(pid))
    ).subscribe(results => {
      results.forEach((evals, i) => {
        const hasRated = evals.some(e => e.donneurId === userId);
        if (hasRated) this.ratedSellers.add(producteurIds[i]);
      });
    });
  }

  showRatingForm(commandeId: string, producteurId: string) {
    this.ratingFormVisible[commandeId] = true;
    this.ratingNotes[commandeId] = 0;
    this.ratingComments[commandeId] = '';
  }

  cancelRating(commandeId: string) {
    this.ratingFormVisible[commandeId] = false;
    this.ratingNotes[commandeId] = 0;
    this.ratingComments[commandeId] = '';
  }

  submitRating(commandeId: string, producteurId: string) {
    const note = this.ratingNotes[commandeId];
    if (!note) return;

    this.ratingSubmitting[commandeId] = true;
    this.evaluationService.create({
      receveurId: producteurId,
      note,
      commentaire: this.ratingComments[commandeId] || '',
    }).subscribe({
      next: () => {
        this.ratingSubmitting[commandeId] = false;
        this.ratingFormVisible[commandeId] = false;
        this.ratedSellers.add(producteurId);
      },
      error: () => {
        this.ratingSubmitting[commandeId] = false;
      }
    });
  }

  payer(commandeId: string, methode: string) {
    this.paiementEnCours = commandeId;
    this.commandeService.payer(commandeId, methode).subscribe({
      next: () => {
        this.commandeService.getMesCommandes().subscribe(data => this.commandes = data);
        this.paiementEnCours = '';
      },
      error: () => { this.paiementEnCours = ''; }
    });
  }

  confirmerReception(commandeId: string) {
    this.receptionEnCours = commandeId;
    this.commandeService.confirmerReception(commandeId).subscribe({
      next: () => {
        this.commandeService.getMesCommandes().subscribe(data => this.commandes = data);
        this.receptionEnCours = '';
      },
      error: () => { this.receptionEnCours = ''; }
    });
  }

  paiementLabel(s: string): string {
    const map: Record<string,string> = { 'PAYE': 'Payé', 'EN_ATTENTE': 'En attente (à la livraison)', 'REMBOURSE': 'Remboursé', 'ECHEC': 'Échoué' };
    return map[s] || s;
  }

  get filtered(): Commande[] {
    if (!this.filtre) return this.commandes;
    return this.commandes.filter(c => c.statut === this.filtre);
  }

  get totalCommandes(): number { return this.commandes.length; }
  get montantTotal(): number { return this.commandes.reduce((s, c) => s + c.montantTotal, 0); }
  get enCours(): number { return this.commandes.filter(c => c.statut !== 'LIVREE' && c.statut !== 'ANNULEE').length; }

  statutLabel(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE': 'En attente', 'CONFIRMEE': 'Confirmée', 'EN_PREPARATION': 'Préparation', 'EN_COURS_LIVRAISON': 'Livraison', 'LIVREE': 'Livrée', 'ANNULEE': 'Annulée' };
    return map[s] || s;
  }

  badgeClass(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE': 'attente', 'CONFIRMEE': 'confirmee', 'EN_PREPARATION': 'preparation', 'EN_COURS_LIVRAISON': 'livraison', 'LIVREE': 'livree', 'ANNULEE': 'annulee' };
    return map[s] || '';
  }
}
