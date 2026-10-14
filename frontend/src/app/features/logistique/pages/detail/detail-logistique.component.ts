import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LogistiqueService } from '../../../../core/services/logistique.service';
import { SuiviLivraison } from '../../../../core/models/livraison.model';

@Component({
  selector: 'app-detail-logistique',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink],
  template: `
    <div class="detail-container">
      <a routerLink="/logistique" class="back-link"><span class="material-icons-outlined">arrow_back</span> Toutes mes livraisons</a>

      <div class="detail-card" *ngIf="suivis.length; else empty">
        <h2>Suivi de livraison</h2>
        <div class="timeline">
          <div *ngFor="let s of suivis; let last = last" class="timeline-item" [class.current]="last">
            <div class="dot" [class.current]="last"></div>
            <div class="timeline-content">
              <p class="status">{{ statutLabel(s.statut) }}</p>
              <p class="loc" *ngIf="s.localisation">
                <span class="material-icons-outlined">location_on</span> {{ s.localisation }}
              </p>
              <p class="date">{{ s.dateMAJ | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty-state" *ngIf="!erreur; else errorTpl">
          <span class="material-icons-outlined">local_shipping</span>
          <h3>Aucune information de suivi</h3>
          <p>Le suivi de cette livraison n'est pas encore disponible.</p>
        </div>
      </ng-template>

      <ng-template #errorTpl>
        <div class="empty-state">
          <span class="material-icons-outlined">error_outline</span>
          <h3>{{ erreur }}</h3>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.2rem; }
    .back-link .material-icons-outlined { font-size: 1.1rem; }
    .detail-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    h2 { font-size: 1.2rem; margin-bottom: 1.25rem; }
    .timeline { position: relative; padding-left: 1.5rem; }
    .timeline::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 2px; background: #c8e6c9; }
    .timeline-item { position: relative; margin-bottom: 1.25rem; }
    .timeline-item.current .dot { background: #16a34a; box-shadow: 0 0 0 4px rgba(22,163,74,0.2); }
    .dot { position: absolute; left: -1.15rem; top: 0.25rem; width: 12px; height: 12px; background: #1a5c2a; border-radius: 50%; }
    .timeline-content .status { font-weight: 600; font-size: 0.95rem; color: #1a5c2a; }
    .timeline-content .loc { color: #555; font-size: 0.85rem; display: flex; align-items: center; gap: 0.2rem; margin-top: 0.2rem; }
    .timeline-content .loc .material-icons-outlined { font-size: 0.9rem; color: #1a5c2a; }
    .timeline-content .date { color: #aaa; font-size: 0.75rem; margin-top: 0.15rem; }

    .empty-state { text-align: center; padding: 3rem; background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; margin-top: 1rem; }
    .empty-state .material-icons-outlined { font-size: 3rem; color: #ccc; margin-bottom: 0.75rem; display: block; }
    .empty-state h3 { font-size: 1rem; margin-bottom: 0.25rem; }
    .empty-state p { color: #888; font-size: 0.85rem; }
  `]
})
export class DetailLogistiqueComponent implements OnInit {
  suivis: SuiviLivraison[] = [];
  erreur = '';

  constructor(
    private route: ActivatedRoute,
    private service: LogistiqueService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getSuivi(id).subscribe({
      next: data => this.suivis = data,
      error: () => this.erreur = 'Impossible de charger le suivi.'
    });
  }

  statutLabel(s: string): string {
    const map: Record<string,string> = {
      'Prise en charge': 'Prise en charge',
      'EN_COURS': 'En cours de livraison',
      'EN_TRANSIT': 'En transit',
      'ARRIVEE': 'Arrivé sur place',
      'LIVREE': 'Livrée',
      'Livrée': 'Livrée'
    };
    return map[s] || s;
  }
}
