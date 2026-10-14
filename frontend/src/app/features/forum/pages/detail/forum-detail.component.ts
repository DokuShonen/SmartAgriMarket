import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../../core/services/forum.service';
import { CommentaireService, Commentaire } from '../../../../core/services/commentaire.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ArticleForum } from '../../../../core/models/article-forum.model';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink, FormsModule],
  template: `
    <p class="erreur" *ngIf="erreur">{{ erreur }}</p>
    <div class="detail-container" *ngIf="article">
      <a routerLink="/forum" class="back-link"><span class="material-icons-outlined">arrow_back</span> Retour au forum</a>
      <article class="article-card">
        <span class="categ" *ngIf="article.categorie">{{ article.categorie }}</span>
        <h1>{{ article.titre }}</h1>
        <p class="meta">
          <span class="article-author-avatar" [style.backgroundImage]="article.auteur?.photoProfil ? 'url(' + article.auteur?.photoProfil + ')' : ''" [class.has-photo]="!!article.auteur?.photoProfil">{{ article.auteur?.photoProfil ? '' : getPseudo(article.auteur).charAt(0).toUpperCase() }}</span>
          {{ getPseudo(article.auteur) }} — {{ article.datePublication | date:'dd/MM/yyyy' }}
        </p>
        <div class="contenu">{{ article.contenu }}</div>
        <p *ngIf="article.estModere" class="modere"><span class="material-icons-outlined" style="font-size:0.9rem;vertical-align:middle">verified</span> Validé par la modération</p>
      </article>

      <!-- Commentaires -->
      <section class="comments-section">
        <h3><span class="material-icons-outlined">chat_bubble</span> Commentaires ({{ commentaires.length }})</h3>

        <div class="comment-form" *ngIf="auth.isLoggedIn">
          <textarea [(ngModel)]="nouveauCommentaire" rows="3" placeholder="Laissez un commentaire..."></textarea>
          <button (click)="posterCommentaire()" [disabled]="!nouveauCommentaire.trim()">Publier</button>
        </div>
        <p class="login-hint" *ngIf="!auth.isLoggedIn">
          <a routerLink="/connexion">Connectez-vous</a> pour commenter.
        </p>

        <div class="comments-list">
          <div *ngFor="let c of commentaires" class="comment">
            <div class="comment-header">
              <span class="comment-avatar" [style.backgroundImage]="c.auteurPhoto ? 'url(' + c.auteurPhoto + ')' : ''" [class.has-photo]="!!c.auteurPhoto">{{ !c.auteurPhoto ? c.auteurNom.charAt(0) : '' }}</span>
              <strong class="comment-author">{{ c.auteurNom }}</strong>
              <span class="comment-date">{{ c.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
            </div>
            <p class="comment-body">{{ c.contenu }}</p>
            <div class="comment-actions">
              <button class="btn-like" [class.liked]="c.liked" (click)="like(c)">
                <span class="material-icons-outlined">{{ c.liked ? 'favorite' : 'favorite_border' }}</span>
                {{ c.likes }}
              </button>
              <button class="btn-reply" (click)="toggleReply(c.id)">
                <span class="material-icons-outlined">reply</span> Répondre
              </button>
            </div>

            <!-- Formulaire réponse -->
            <div class="reply-form" *ngIf="replyTo === c.id">
              <textarea [(ngModel)]="replyContenu" rows="2" placeholder="Votre réponse..."></textarea>
              <div class="reply-actions">
                <button (click)="posterReponse(c.id)" [disabled]="!replyContenu.trim()">Répondre</button>
                <button class="btn-cancel" (click)="replyTo = ''">Annuler</button>
              </div>
            </div>

            <!-- Réponses imbriquées -->
            <div *ngIf="c.reponses?.length" class="reponses">
              <div *ngFor="let r of c.reponses" class="comment reponse">
                <div class="comment-header">
                  <span class="comment-avatar small" [style.backgroundImage]="r.auteurPhoto ? 'url(' + r.auteurPhoto + ')' : ''" [class.has-photo]="!!r.auteurPhoto">{{ !r.auteurPhoto ? r.auteurNom.charAt(0) : '' }}</span>
                  <strong class="comment-author">{{ r.auteurNom }}</strong>
                  <span class="comment-date">{{ r.dateCreation | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
                <p class="comment-body">{{ r.contenu }}</p>
                <div class="comment-actions">
                  <button class="btn-like" [class.liked]="r.liked" (click)="like(r)">
                    <span class="material-icons-outlined">{{ r.liked ? 'favorite' : 'favorite_border' }}</span>
                    {{ r.likes }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .erreur { background: #ffebee; color: #c62828; text-align: center; padding: 0.75rem; font-size: 0.9rem; font-weight: 600; margin: 1rem; border-radius: 6px; }
    .detail-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.2rem; }
    .article-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    .categ { display: inline-block; padding: 0.2rem 0.6rem; background: #e3f2fd; color: #1565c0; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
    h1 { font-size: 1.5rem; margin: 0.75rem 0 0.25rem; }
    .meta { color: #888; font-size: 0.8rem; }
    .contenu { margin-top: 1rem; line-height: 1.8; color: #444; white-space: pre-wrap; }
    .modere { margin-top: 1rem; font-size: 0.8rem; color: #1a5c2a; font-weight: 600; display: flex; align-items: center; gap: 0.2rem; }

    .comments-section { margin-top: 2rem; }
    .comments-section h3 { font-size: 1.1rem; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.4rem; }

    .comment-form { margin-bottom: 1.5rem; }
    .comment-form textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 0.9rem; resize: vertical; font-family: inherit; }
    .comment-form button { margin-top: 0.5rem; padding: 0.5rem 1.2rem; background: #1a5c2a; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .comment-form button:hover { background: #2e7d32; }
    .comment-form button:disabled { opacity: 0.5; }

    .login-hint { color: #888; font-size: 0.85rem; margin-bottom: 1rem; }
    .login-hint a { color: #1a5c2a; font-weight: 600; }

    .comment { background: #fff; border: 1px solid #f0f0f0; border-radius: 8px; padding: 0.75rem 1rem; margin-bottom: 0.5rem; }
    .comment-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
    .article-author-avatar {
      width: 24px; height: 24px; border-radius: 50%;
      background: var(--green-100); background-size: cover; background-position: center;
      color: var(--green-700);
      display: inline-flex; align-items: center; justify-content: center;
      font-size: 0.65rem; font-weight: 700;
      vertical-align: middle; margin-right: 4px;
    }
    .comment-avatar { width: 28px; height: 28px; background: #e8f5e9; background-size: cover; background-position: center; color: #1a5c2a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; }
    .comment-avatar.has-photo { background-size: cover; background-position: center; }
    .comment-avatar.small { width: 22px; height: 22px; font-size: 0.65rem; }
    .comment-author { font-size: 0.85rem; }
    .comment-date { font-size: 0.7rem; color: #aaa; margin-left: auto; }
    .comment-body { font-size: 0.9rem; line-height: 1.5; color: #333; margin-bottom: 0.4rem; }

    .comment-actions { display: flex; gap: 0.75rem; }
    .btn-like, .btn-reply { background: none; border: none; color: #888; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.15rem; padding: 0.2rem 0; }
    .btn-like .material-icons-outlined { font-size: 0.95rem; }
    .btn-like.liked { color: #e53935; }
    .btn-reply .material-icons-outlined { font-size: 0.9rem; }

    .reply-form { margin: 0.5rem 0 0.5rem 2.5rem; }
    .reply-form textarea { width: 100%; padding: 0.5rem; border: 1px solid #ddd; border-radius: 6px; font-size: 0.85rem; resize: vertical; font-family: inherit; }
    .reply-actions { display: flex; gap: 0.5rem; margin-top: 0.4rem; }
    .reply-actions button { padding: 0.35rem 0.8rem; border: none; border-radius: 5px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
    .reply-actions button:first-child { background: #1a5c2a; color: #fff; }
    .btn-cancel { background: #f5f5f5; color: #888; }

    .reponses { margin-left: 2.5rem; margin-top: 0.5rem; }
    .reponse { background: #fafafa; border-left: 3px solid #e8f5e9; }
  `]
})
export class ForumDetailComponent implements OnInit {
  article?: ArticleForum;
  commentaires: Commentaire[] = [];
  nouveauCommentaire = '';
  replyTo = '';
  replyContenu = '';
  erreur = '';

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private commentaireService: CommentaireService,
    public auth: AuthService
  ) {}

  getPseudo(auteur?: { prenom: string; nom: string; pseudoForum?: string }): string {
    return auteur?.pseudoForum || (auteur ? auteur.prenom + ' ' + auteur.nom : 'Anonyme');
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.forumService.getArticles().subscribe({
      next: data => this.article = data.find(a => a.id === id),
      error: () => this.erreur = 'Impossible de charger l\'article'
    });
    this.chargerCommentaires(id);
  }

  chargerCommentaires(articleId: string) {
    this.commentaireService.getParArticle(articleId).subscribe({
      next: data => this.commentaires = data,
      error: () => this.erreur = 'Impossible de charger les commentaires'
    });
  }

  posterCommentaire() {
    if (!this.nouveauCommentaire.trim() || !this.article) return;
    this.erreur = '';
    this.commentaireService.creer({
      articleId: this.article.id,
      contenu: this.nouveauCommentaire
    }).subscribe({
      next: () => {
        this.nouveauCommentaire = '';
        this.chargerCommentaires(this.article!.id);
      },
      error: (err) => {
        this.erreur = err.error?.error || 'Erreur lors de la publication';
      }
    });
  }

  toggleReply(commentaireId: string) {
    this.replyTo = this.replyTo === commentaireId ? '' : commentaireId;
    this.replyContenu = '';
  }

  posterReponse(parentId: string) {
    if (!this.replyContenu.trim() || !this.article) return;
    this.erreur = '';
    this.commentaireService.creer({
      articleId: this.article.id,
      contenu: this.replyContenu,
      parentId
    }).subscribe({
      next: () => {
        this.replyContenu = '';
        this.replyTo = '';
        this.chargerCommentaires(this.article!.id);
      },
      error: (err) => {
        this.erreur = err.error?.error || 'Erreur lors de la publication de la réponse';
      }
    });
  }

  like(commentaire: Commentaire) {
    this.commentaireService.toggleLike(commentaire.id).subscribe({
      next: updated => {
        commentaire.likes = updated.likes;
        commentaire.liked = updated.liked;
      },
      error: () => this.erreur = 'Erreur lors du like'
    });
  }
}
