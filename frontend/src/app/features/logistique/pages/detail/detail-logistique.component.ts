import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LogistiqueService } from '../../../../core/services/logistique.service';
import { DemandeLivraison, SuiviLivraison } from '../../../../core/models/livraison.model';

@Component({
  selector: 'app-detail-logistique',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink],
  template: `
    <div class="detail-container">
      <a routerLink="/logistique" class="back-link">← Toutes mes livraisons</a>

      <div class="detail-card" *ngIf="suivis.length; else empty">
        <h2>Suivi de livraison</h2>
        <div class="timeline">
          <div *ngFor="let s of suivis" class="timeline-item">
            <div class="dot"></div>
            <div class="timeline-content">
              <p class="status">{{ s.statut }}</p>
              <p class="loc" *ngIf="s.localisation">{{ s.localisation }}</p>
              <p class="date">{{ s.dateMAJ | date:'dd/MM/yyyy HH:mm' }}</p>
            </div>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty">Aucune information de suivi disponible.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; }
    .detail-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    h2 { font-size: 1.2rem; margin-bottom: 1.25rem; }
    .timeline { position: relative; padding-left: 1.5rem; }
    .timeline::before { content: ''; position: absolute; left: 6px; top: 0; bottom: 0; width: 2px; background: #c8e6c9; }
    .timeline-item { position: relative; margin-bottom: 1.25rem; }
    .dot { position: absolute; left: -1.15rem; top: 0.25rem; width: 12px; height: 12px; background: #1a5c2a; border-radius: 50%; }
    .timeline-content .status { font-weight: 600; font-size: 0.9rem; }
    .timeline-content .loc { color: #555; font-size: 0.85rem; }
    .timeline-content .date { color: #aaa; font-size: 0.75rem; }
    .empty { text-align: center; padding: 3rem; color: #888; }
  `]
})
export class DetailLogistiqueComponent implements OnInit {
  suivis: SuiviLivraison[] = [];

  constructor(
    private route: ActivatedRoute,
    private service: LogistiqueService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getSuivi(id).subscribe(data => this.suivis = data);
  }
}
