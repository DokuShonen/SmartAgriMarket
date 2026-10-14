import { Component, Input, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { LogistiqueService } from '../../core/services/logistique.service';
import { SuiviLivraison } from '../../core/models/livraison.model';

@Component({
  selector: 'app-suivi-colis',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe],
  template: `
    <div class="suivi-colis" *ngIf="suivis.length || loading">
      <h4 class="suivi-title">
        <span class="material-icons-outlined">local_shipping</span>
        Suivi de livraison
      </h4>

      <div class="suivi-loading" *ngIf="loading">
        <div class="skel-line"></div>
        <div class="skel-line short"></div>
      </div>

      <div class="timeline" *ngIf="!loading && suivis.length">
        <div *ngFor="let s of suivis; let last = last; let i = index" class="tl-item" [class.current]="last">
          <div class="tl-dot" [class.current]="last" [class.done]="!last">
            <span class="material-icons-outlined" *ngIf="!last">check</span>
          </div>
          <div class="tl-line" *ngIf="!last"></div>
          <div class="tl-content">
            <span class="tl-status">{{ statutLabel(s.statut) }}</span>
            <span class="tl-loc" *ngIf="s.localisation">
              <span class="material-icons-outlined">location_on</span> {{ s.localisation }}
            </span>
            <span class="tl-date">{{ s.dateMAJ | date:'dd/MM/yyyy HH:mm' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .suivi-colis {
      background: var(--g-50);
      border: 1px solid var(--g-100);
      border-radius: 12px;
      padding: 14px;
      margin-top: 10px;
    }
    .suivi-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 12px;
    }
    .suivi-title .material-icons-outlined { font-size: 16px; color: var(--brand); }

    .timeline { position: relative; padding-left: 20px; }
    .tl-item { position: relative; padding-bottom: 16px; padding-left: 20px; }
    .tl-item:last-child { padding-bottom: 0; }

    .tl-dot {
      position: absolute;
      left: -20px;
      top: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--n-200);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }
    .tl-dot.done { background: var(--brand); }
    .tl-dot.current {
      background: var(--brand);
      box-shadow: 0 0 0 4px rgba(39, 163, 55, 0.2);
    }
    .tl-dot .material-icons-outlined { font-size: 10px; color: #fff; }

    .tl-line {
      position: absolute;
      left: -13px;
      top: 18px;
      width: 2px;
      height: calc(100% - 10px);
      background: var(--g-200);
    }

    .tl-content { display: flex; flex-direction: column; gap: 2px; }
    .tl-status {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--heading-color);
    }
    .tl-item.current .tl-status { color: var(--brand); }
    .tl-loc {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--text-secondary);
    }
    .tl-loc .material-icons-outlined { font-size: 12px; color: var(--brand); }
    .tl-date { font-size: 10px; color: var(--text-dim); }

    .skel-line {
      height: 12px;
      background: var(--n-100);
      border-radius: 6px;
      margin-bottom: 8px;
      animation: shimmer 1.5s infinite;
    }
    .skel-line.short { width: 60%; }
    @keyframes shimmer {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  `]
})
export class SuiviColisComponent implements OnInit {
  @Input() commandeId = '';
  suivis: SuiviLivraison[] = [];
  loading = false;

  constructor(private logistiqueService: LogistiqueService) {}

  ngOnInit() {
    if (this.commandeId) {
      this.loadSuivi();
    }
  }

  loadSuivi() {
    this.loading = true;
    this.logistiqueService.getDemande(this.commandeId).subscribe({
      next: (demande) => {
        if (demande?.id) {
          this.logistiqueService.getSuivi(demande.id).subscribe({
            next: (data) => { this.suivis = data; this.loading = false; },
            error: () => { this.loading = false; }
          });
        } else {
          this.loading = false;
        }
      },
      error: () => { this.loading = false; }
    });
  }

  statutLabel(s: string): string {
    const map: Record<string, string> = {
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
