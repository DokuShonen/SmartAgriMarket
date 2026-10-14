import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, SlicePipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { retry, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading.component';
import { ForumService } from '../../../../core/services/forum.service';
import { ArticleForum, ContenuApprentissage } from '../../../../core/models/article-forum.model';
import { ModalComponent } from '../../../../core/components/modal.component';
import { ForumFormComponent } from '../form/forum-form.component';
import { BackendHealthService } from '../../../../core/services/backend-health.service';

@Component({
  selector: 'app-forum-liste',
  standalone: true,
  imports: [NgFor, NgIf, SlicePipe, DatePipe, RouterLink, FormsModule, ModalComponent, ForumFormComponent, LoadingComponent],
  template: `
    <div class="forum-page">
      <!-- HEADER -->
      <div class="forum-header">
        <h1>Forum</h1>
      </div>

      <!-- TABS -->
      <div class="tabs">
        <button [class.active]="onglet === 'forum'" (click)="onglet = 'forum'">
          <span class="material-icons-outlined">forum</span>
          <span>Discussions</span>
        </button>
        <button [class.active]="onglet === 'apprentissage'" (click)="onglet = 'apprentissage'">
          <span class="material-icons-outlined">school</span>
          <span>Apprentissage</span>
        </button>
      </div>

      <!-- FORUM TAB -->
      <ng-container *ngIf="onglet === 'forum'">
        <!-- SEARCH -->
        <div class="search-bar">
          <span class="material-icons-outlined">search</span>
          <input type="text" [(ngModel)]="recherche" (input)="chercher()" placeholder="Rechercher..." />
          <button *ngIf="recherche" class="search-clear" (click)="recherche = ''; chercher()">
            <span class="material-icons-outlined">close</span>
          </button>
        </div>

        <!-- POSTS -->
        <div *ngIf="articles.length; else empty" class="post-list">
          <a *ngFor="let a of articles" [routerLink]="'/forum/' + a.id" class="post-card">
            <div class="post-avatar" [style.backgroundImage]="a.auteur?.photoProfil ? 'url(' + a.auteur?.photoProfil + ')' : ''" [class.has-photo]="!!a.auteur?.photoProfil">
              <span *ngIf="!a.auteur?.photoProfil">{{ getPseudo(a.auteur).charAt(0).toUpperCase() }}</span>
            </div>
            <div class="post-body">
              <div class="post-meta">
                <span class="post-author">{{ getPseudo(a.auteur) }}</span>
                <span class="post-date">{{ a.datePublication | date:'dd/MM HH:mm' }}</span>
              </div>
              <h3 class="post-title">{{ a.titre }}</h3>
              <p class="post-preview">{{ a.contenu | slice:0:150 }}</p>
              <div class="post-tags">
                <span class="tag" *ngIf="a.categorie">{{ a.categorie }}</span>
                <span class="tag verified" *ngIf="a.estModere">
                  <span class="material-icons-outlined">verified</span> Modéré
                </span>
              </div>
            </div>
          </a>
        </div>
      </ng-container>

      <!-- APPRENTISSAGE TAB -->
      <ng-container *ngIf="onglet === 'apprentissage'">
        <div *ngIf="apprentissages.length; else empty" class="learn-list">
          <a *ngFor="let c of apprentissages" [routerLink]="'/forum/apprentissage/' + c.id" class="learn-card">
            <div class="learn-icon">
              <span class="material-icons-outlined">{{ c.typeContenu === 'VIDEO' ? 'play_circle' : c.typeContenu === 'GUIDE' ? 'menu_book' : 'article' }}</span>
            </div>
            <div class="learn-body">
              <span class="learn-type">{{ c.typeContenu }}</span>
              <h3>{{ c.titre }}</h3>
              <p class="learn-preview">{{ c.contenu | slice:0:120 }}...</p>
              <span class="learn-validated" *ngIf="c.estValide">
                <span class="material-icons-outlined">check_circle</span> Validé
              </span>
            </div>
          </a>
        </div>
      </ng-container>

      <!-- EMPTY -->
      <ng-template #empty>
        <div class="empty-state">
          <span class="material-icons-outlined">forum</span>
          <h3>Aucun contenu</h3>
          <p>Soyez le premier à publier !</p>
        </div>
      </ng-template>
    </div>

    <!-- FAB -->
    <button class="fab" (click)="showForm = true" *ngIf="onglet === 'forum'">
      <span class="material-icons-outlined">edit</span>
    </button>

    <!-- MODAL -->
    <app-modal [open]="showForm" titre="Nouveau message" (closed)="showForm = false; charger()">
      <app-forum-form (saved)="showForm = false; charger()" (cancelled)="showForm = false"></app-forum-form>
    </app-modal>
  `,
  styles: [`
    .forum-page { padding: 1rem; max-width: 640px; margin: 0 auto; padding-bottom: 80px; }

    /* === HEADER === */
    .forum-header { margin-bottom: 12px; }
    .forum-header h1 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--heading-color);
    }

    /* === TABS === */
    .tabs {
      display: flex;
      gap: 0;
      border-bottom: 2px solid var(--n-100);
      margin-bottom: 16px;
    }
    .tabs button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 4px;
      border: none;
      background: none;
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-dim);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: color 0.15s;
    }
    .tabs button.active { color: var(--brand); border-bottom-color: var(--brand); }
    .tabs button:active { background: var(--g-50); }
    .tabs button .material-icons-outlined { font-size: 18px; }

    /* === SEARCH === */
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      border: 1px solid var(--n-200);
      border-radius: 12px;
      padding: 0 12px;
      height: 44px;
      margin-bottom: 16px;
    }
    .search-bar .material-icons-outlined { font-size: 20px; color: var(--text-dim); flex-shrink: 0; }
    .search-bar input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 15px;
      outline: none;
      min-width: 0;
    }
    .search-bar input::placeholder { color: var(--text-dim); }
    .search-clear {
      width: 28px;
      height: 28px;
      border: none;
      background: var(--n-100);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .search-clear .material-icons-outlined { font-size: 16px; color: var(--text-secondary); }

    /* === POST LIST === */
    .post-list { display: flex; flex-direction: column; gap: 8px; }

    .post-card {
      display: flex;
      gap: 12px;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 12px;
      padding: 14px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s;
    }
    .post-card:active { transform: scale(0.98); }

    .post-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--g-100);
      color: var(--brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      flex-shrink: 0;
    }

    .post-body { flex: 1; min-width: 0; }
    .post-meta { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
    .post-author { font-family: var(--font-display); font-size: 13px; font-weight: 700; color: var(--heading-color); }
    .post-date { font-size: 11px; color: var(--text-dim); }

    .post-title {
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 4px;
      line-height: 1.3;
    }
    .post-preview {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.4;
      margin-bottom: 6px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .tag {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      padding: 2px 8px;
      background: var(--g-50);
      border-radius: 10px;
      font-size: 10px;
      font-weight: 600;
      color: var(--brand);
    }
    .tag.verified { background: #dbeafe; color: #1d4ed8; }
    .tag .material-icons-outlined { font-size: 12px; }

    /* === LEARN LIST === */
    .learn-list { display: flex; flex-direction: column; gap: 10px; }

    .learn-card {
      display: flex;
      gap: 12px;
      background: #fff;
      border: 1px solid var(--n-100);
      border-left: 3px solid var(--brand);
      border-radius: 12px;
      padding: 14px;
      text-decoration: none;
      color: inherit;
      transition: transform 0.15s;
    }
    .learn-card:active { transform: scale(0.98); }

    .learn-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: var(--g-50);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .learn-icon .material-icons-outlined { font-size: 20px; color: var(--brand); }

    .learn-body { flex: 1; min-width: 0; }
    .learn-type {
      display: inline-block;
      padding: 1px 6px;
      background: var(--g-50);
      border-radius: 6px;
      font-size: 10px;
      font-weight: 600;
      color: var(--brand);
      margin-bottom: 4px;
    }
    .learn-body h3 {
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 4px;
    }
    .learn-preview {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.4;
      margin-bottom: 6px;
    }
    .learn-validated {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 11px;
      color: var(--brand);
      font-weight: 600;
    }
    .learn-validated .material-icons-outlined { font-size: 14px; }

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
    .empty-state p { font-size: 13px; color: var(--text-secondary); }

    /* === FAB === */
    .fab {
      position: fixed;
      bottom: 80px;
      right: 16px;
      width: 56px;
      height: 56px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(39, 163, 55, 0.4);
      z-index: 50;
      transition: transform 0.2s;
    }
    .fab:active { transform: scale(0.9); }
    .fab .material-icons-outlined { font-size: 28px; }

    @media (min-width: 769px) {
      .forum-page { padding: 2rem; }
      .forum-header h1 { font-size: 1.8rem; }
      .fab { bottom: 24px; right: 24px; width: 60px; height: 60px; }
    }
  `]
})
export class ForumListeComponent implements OnInit {
  articles: ArticleForum[] = [];
  tousLesArticles: ArticleForum[] = [];
  apprentissages: ContenuApprentissage[] = [];
  recherche = '';
  onglet: 'forum' | 'apprentissage' = 'forum';
  showForm = false;
  chargement = true;
  erreur = '';

  constructor(private forumService: ForumService, private backendHealth: BackendHealthService) {}

  ngOnInit() { this.charger(); }

  charger() {
    this.chargement = true;
    this.erreur = '';
    this.backendHealth.waitForBackend(2000, 15).pipe(
      switchMap((ready) => {
        if (!ready) {
          this.chargement = false;
          this.erreur = 'Serveur non disponible.';
          return of(null);
        }
        return this.forumService.getArticles();
      })
    ).pipe(retry(3)).subscribe({
      next: data => { if (data) { this.tousLesArticles = data; this.articles = data; this.chargement = false; } },
      error: () => { this.chargement = false; this.erreur = 'Serveur non disponible.'; }
    });
    this.backendHealth.waitForBackend(2000, 15).pipe(
      switchMap((ready) => {
        if (!ready) return of(null);
        return this.forumService.getApprentissages();
      })
    ).pipe(retry(3)).subscribe({
      next: data => { if (data) this.apprentissages = data; },
      error: () => {}
    });
  }

  chercher() {
    if (!this.recherche.trim()) {
      this.articles = this.tousLesArticles;
      return;
    }
    this.chargement = true;
    this.forumService.rechercherArticles(this.recherche).subscribe(data => {
      this.articles = data;
      this.chargement = false;
    });
  }

  getPseudo(auteur?: { prenom: string; nom: string; pseudoForum?: string }): string {
    return auteur?.pseudoForum || (auteur ? auteur.prenom + ' ' + auteur.nom : 'Anonyme');
  }
}
