import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnnonceMateriel } from '../../../../core/models/annonce-materiel.model';
import { AnnonceMaterielService } from '../../../../core/services/annonce-materiel.service';
import { MessagerieService } from '../../../../core/services/messagerie.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalComponent } from '../../../../core/components/modal.component';
import { FormMaterielComponent } from '../form/form-materiel.component';

@Component({
  selector: 'app-detail-materiel',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, ModalComponent, FormMaterielComponent],
  template: `
    <div class="detail-container" *ngIf="annonce; else loading">
      <div class="detail-top-bar">
        <a routerLink="/materiel" class="back-link"><span class="material-icons-outlined">arrow_back</span> Retour</a>
        <div class="owner-actions" *ngIf="isOwner">
          <button class="btn-icon" (click)="showEdit = true">
            <span class="material-icons-outlined">edit</span> Modifier
          </button>
          <button class="btn-icon btn-danger" (click)="supprimer()">
            <span class="material-icons-outlined">delete</span> Supprimer
          </button>
        </div>
      </div>
      <div class="detail-card">
        <div class="photos" *ngIf="annonce.photos?.length">
          <div class="photo-main">
            <img [src]="photos[selectedPhoto]" [alt]="annonce.titre" />
          </div>
          <div class="photo-thumbs" *ngIf="photos.length > 1">
            <button *ngFor="let p of photos; let i = index" class="thumb" [class.active]="i === selectedPhoto" (click)="selectedPhoto = i">
              <img [src]="p" [alt]="'Photo ' + (i+1)" />
            </button>
          </div>
        </div>
        <div class="no-photos" *ngIf="!annonce.photos?.length">
          <span class="material-icons-outlined">image</span>
        </div>
        <h1>{{ annonce.titre }}</h1>
        <div class="badges-row">
          <span class="badge" [class.vente]="annonce.typeTransaction === 'VENTE'" [class.location]="annonce.typeTransaction === 'LOCATION'">
            {{ annonce.typeTransaction === 'VENTE' ? 'Vente' : 'Location' }}
          </span>
          <span class="badge etat-badge">{{ annonce.etat === 'NEUF' ? 'Neuf' : 'Occasion' }}</span>
        </div>
        <p class="price">{{ annonce.prix ? (annonce.prix | number) + ' FCFA' : 'Prix à discuter' }}
          <span *ngIf="annonce.typeTransaction === 'LOCATION' && annonce.duree" class="duree-label">/ {{ annonce.duree }}</span>
        </p>
        <p *ngIf="annonce.description" class="desc">{{ annonce.description }}</p>
        <div class="info-row" *ngIf="annonce.duree">
          <span class="material-icons-outlined">schedule</span>
          <span>Durée : {{ annonce.duree }}</span>
        </div>
        <div class="info-row" *ngIf="annonce.caution">
          <span class="material-icons-outlined">lock</span>
          <span>Caution : {{ annonce.caution | number }} FCFA</span>
        </div>
        <div class="info-row" *ngIf="annonce.disponibilites">
          <span class="material-icons-outlined">calendar_today</span>
          <span>{{ annonce.disponibilites }}</span>
        </div>
        <div class="info-row">
          <span class="material-icons-outlined">person</span>
          <span>{{ annonce.vendeurNom }}</span>
        </div>
        <div class="info-row">
          <span class="material-icons-outlined">location_on</span>
          <span>{{ annonce.localite }}</span>
        </div>
        <button class="btn-contact" (click)="envoyerMessage()" *ngIf="authService.isLoggedIn && !isOwner" [disabled]="contactEnvoiEnCours">
          <span class="material-icons-outlined">{{ contactEnvoiEnCours ? 'hourglass_top' : 'chat' }}</span>
          {{ contactEnvoiEnCours ? 'Envoi...' : 'Contacter le vendeur' }}
        </button>
        <p class="contact-erreur" *ngIf="contactErreur">{{ contactErreur }}</p>
        <a routerLink="/auth/login" class="btn-contact" *ngIf="!authService.isLoggedIn">
          <span class="material-icons-outlined">chat</span> Connectez-vous pour contacter
        </a>
      </div>
    </div>
    <ng-template #loading>
      <div class="detail-container">
        <div class="detail-card" *ngIf="erreur; else skeleton">
          <p class="error-msg">{{ erreur }}</p>
        </div>
        <ng-template #skeleton>
          <div class="detail-card skeleton-card">
            <div class="skel skel-title"></div>
            <div class="skel skel-text"></div>
            <div class="skel skel-text short"></div>
          </div>
        </ng-template>
      </div>
    </ng-template>

    <app-modal [open]="showEdit" titre="Modifier l'annonce" (closed)="showEdit = false">
      <app-form-materiel [editId]="annonce?.id ?? null" [initialData]="annonce" (saved)="onEdited()" (cancelled)="showEdit = false"></app-form-materiel>
    </app-modal>
  `,
  styles: [`
    .detail-container { max-width: 640px; margin: 2rem auto; padding: 0 1rem; }
    .detail-top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.2rem; }
    .back-link .material-icons-outlined { font-size: 1.1rem; }
    .owner-actions { display: flex; gap: 6px; }
    .btn-icon {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      border: 1px solid var(--n-200);
      background: #fff;
      border-radius: 8px;
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-icon:hover { background: var(--g-50); border-color: var(--brand); color: var(--brand); }
    .btn-icon .material-icons-outlined { font-size: 15px; }
    .btn-icon.btn-danger { color: #dc2626; border-color: #fecaca; }
    .btn-icon.btn-danger:hover { background: #fef2f2; border-color: #dc2626; }
    .detail-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    h1 { font-size: 1.4rem; margin-bottom: 0.5rem; }
    .badges-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
    .badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
    .badge.vente { background: #e3f2fd; color: #1565c0; }
    .badge.echange { background: #fff3e0; color: #e65100; }
    .badge.location { background: #ede7f6; color: #4527a0; }
    .badge.etat-badge { background: #f3f4f6; color: #555; }
    .price { font-size: 1.5rem; font-weight: 700; color: #1a5c2a; margin: 0.75rem 0; }
    .duree-label { font-size: 0.9rem; font-weight: 500; color: #888; }
    .desc { color: #555; line-height: 1.6; margin-bottom: 1rem; }
    .info-row { display: flex; align-items: center; gap: 0.4rem; font-size: 0.9rem; color: #555; margin-bottom: 0.4rem; }
    .info-row .material-icons-outlined { font-size: 1rem; color: #1a5c2a; }
    .btn-contact { display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 1rem; padding: 0.7rem 1.5rem; background: #1a5c2a; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 0.9rem; cursor: pointer; border: none; }
    .btn-contact:hover { background: #145222; }
    .btn-contact:disabled { opacity: 0.6; cursor: not-allowed; }
    .contact-erreur { color: #dc2626; font-size: 0.82rem; margin-top: 0.5rem; }

    .photos { margin-bottom: 1.25rem; }
    .photo-main { border-radius: 8px; overflow: hidden; margin-bottom: 0.5rem; }
    .photo-main img { width: 100%; height: 300px; object-fit: cover; display: block; }
    .photo-thumbs { display: flex; gap: 0.4rem; overflow-x: auto; }
    .thumb { width: 60px; height: 60px; border: 2px solid transparent; border-radius: 6px; overflow: hidden; cursor: pointer; padding: 0; background: none; flex-shrink: 0; }
    .thumb.active { border-color: #1a5c2a; }
    .thumb img { width: 100%; height: 100%; object-fit: cover; }
    .no-photos { text-align: center; padding: 3rem; background: #f5f5f5; border-radius: 8px; margin-bottom: 1rem; }
    .no-photos .material-icons-outlined { font-size: 3rem; color: #ccc; }

    .error-msg { color: #dc2626; text-align: center; padding: 2rem; }
    .skeleton-card { min-height: 200px; }
    .skel { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 0.75rem; }
    .skel-title { height: 1.5rem; width: 60%; }
    .skel-text { height: 0.9rem; width: 100%; }
    .skel-text.short { width: 40%; }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
  `]
})
export class DetailMaterielComponent implements OnInit {
  annonce?: AnnonceMateriel;
  photos: string[] = [];
  selectedPhoto = 0;
  erreur = '';
  contactErreur = '';
  contactEnvoiEnCours = false;
  showEdit = false;

  get isOwner(): boolean {
    const userId = this.authService.utilisateur()?.id;
    return !!userId && !!this.annonce && this.annonce.vendeurId === userId;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: AnnonceMaterielService,
    private messagerieService: MessagerieService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe({
      next: data => {
        this.annonce = data;
        this.photos = data.photos?.length ? data.photos : [];
      },
      error: () => this.erreur = 'Annonce introuvable.'
    });
  }

  onEdited() {
    this.showEdit = false;
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe({
      next: data => { this.annonce = data; this.photos = data.photos?.length ? data.photos : []; }
    });
  }

  supprimer() {
    if (!this.annonce || !confirm('Supprimer cette annonce ?')) return;
    this.service.delete(this.annonce.id).subscribe({
      next: () => this.router.navigate(['/materiel']),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  envoyerMessage() {
    if (!this.annonce?.vendeurId) return;
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.contactErreur = '';
    this.contactEnvoiEnCours = true;
    this.messagerieService.createConversation(this.annonce.vendeurId).subscribe({
      next: (conv) => {
        this.messagerieService.sendMessage('Bonjour, je suis intéressé(e) par votre annonce.', conv.id).subscribe({
          next: () => {
            this.contactEnvoiEnCours = false;
            this.router.navigate(['/messagerie', conv.id]);
          },
          error: () => {
            this.contactEnvoiEnCours = false;
            this.router.navigate(['/messagerie', conv.id]);
          }
        });
      },
      error: (err) => {
        this.contactEnvoiEnCours = false;
        console.error('Erreur création conversation:', err);
        this.contactErreur = err.error?.error || 'Erreur lors de la création de la conversation. Veuillez réessayer.';
      }
    });
  }
}
