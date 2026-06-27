import { Component, OnInit } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ForumService } from '../../../../core/services/forum.service';
import { ArticleForum } from '../../../../core/models/article-forum.model';

@Component({
  selector: 'app-forum-detail',
  standalone: true,
  imports: [NgIf, DatePipe, RouterLink],
  template: `
    <div class="detail-container" *ngIf="article">
      <a routerLink="/forum" class="back-link">← Retour au forum</a>
      <article class="article-card">
        <span class="categ">{{ article.categorie }}</span>
        <h1>{{ article.titre }}</h1>
        <p class="meta">{{ article.auteurNom }} — {{ article.datePublication | date:'dd/MM/yyyy' }}</p>
        <div class="contenu">{{ article.contenu }}</div>
        <p *ngIf="article.estModere" class="modere">Validé par la modération</p>
      </article>
    </div>
  `,
  styles: [`
    .detail-container { max-width: 720px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; }
    .article-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.5rem; margin-top: 1rem; }
    .categ { display: inline-block; padding: 0.2rem 0.6rem; background: #e3f2fd; color: #1565c0; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
    h1 { font-size: 1.5rem; margin: 0.75rem 0 0.25rem; }
    .meta { color: #888; font-size: 0.8rem; }
    .contenu { margin-top: 1rem; line-height: 1.8; color: #444; white-space: pre-wrap; }
    .modere { margin-top: 1rem; font-size: 0.8rem; color: #1a5c2a; font-weight: 600; }
  `]
})
export class ForumDetailComponent implements OnInit {
  article?: ArticleForum;

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.forumService.getArticles().subscribe(data => {
      this.article = data.find(a => a.id === id);
    });
  }
}
