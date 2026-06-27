import { Component, OnInit } from '@angular/core';
import { NgIf, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnnonceMateriel } from '../../../../core/models/annonce-materiel.model';
import { AnnonceMaterielService } from '../../../../core/services/annonce-materiel.service';

@Component({
  selector: 'app-detail-materiel',
  standalone: true,
  imports: [NgIf, DecimalPipe, RouterLink],
  template: `
    <div class="detail-container" *ngIf="a">
      <a routerLink="/materiel" class="back-link">← Retour</a>
      <div class="detail-card">
        <h1>{{ a.titre }}</h1>
        <p class="badge" [class.vente]="a.typeTransaction === 'VENTE'" [class.echange]="a.typeTransaction === 'ECHANGE'">
          {{ a.typeTransaction === 'VENTE' ? 'Vente' : 'Échange' }}
        </p>
        <p class="etat">{{ a.etat === 'NEUF' ? 'Neuf' : 'Occasion' }}</p>
        <p class="price">{{ a.prix ? (a.prix | number) + ' FCFA' : 'Prix à discuter' }}</p>
        <p *ngIf="a.description" class="desc">{{ a.description }}</p>
        <p class="meta"><strong>Vendeur :</strong> {{ a.vendeurNom }}</p>
        <p class="meta"><strong>Localité :</strong> {{ a.localite }}</p>
        <a routerLink="/messagerie" class="btn-contact">Contacter le vendeur</a>
      </div>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; }
    .detail-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
    .badge.vente { background: #e3f2fd; color: #1565c0; }
    .badge.echange { background: #fff3e0; color: #e65100; }
    .etat { margin-top: 0.5rem; color: #888; font-size: 0.85rem; }
    .price { font-size: 1.5rem; font-weight: 700; color: #1a5c2a; margin: 0.75rem 0; }
    .desc { color: #555; line-height: 1.6; margin-bottom: 1rem; }
    .meta { font-size: 0.9rem; margin-bottom: 0.3rem; }
    .btn-contact { display: inline-block; margin-top: 1rem; padding: 0.7rem 1.5rem; background: #1a5c2a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; }
  `]
})
export class DetailMaterielComponent implements OnInit {
  a?: AnnonceMateriel;

  constructor(
    private route: ActivatedRoute,
    private service: AnnonceMaterielService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe(data => this.a = data);
  }
}
