import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../core/services/forum.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { ArticleForum, ContenuApprentissage } from '../../../core/models/article-forum.model';
import { Utilisateur } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, DatePipe, FormsModule],
  templateUrl: './admin-panel.component.html',
  styles: [`
    .admin-container { max-width: 960px; margin: 0 auto; padding: 1.5rem 1rem; }
    h2 { font-size: 1.4rem; margin-bottom: 0.25rem; }
    .sub { color: #888; font-size: 0.85rem; margin-bottom: 1.25rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.5rem; }
    .tabs button { padding: 0.4rem 1rem; border: none; background: none; cursor: pointer; font-size: 0.9rem; color: #888; font-weight: 500; }
    .tabs button.active { color: #1a5c2a; border-bottom: 2px solid #1a5c2a; }
    .card { background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem; }
    .card h3 { font-size: 1rem; margin-bottom: 0.25rem; }
    .card .meta { color: #888; font-size: 0.8rem; }
    .badge { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .badge.ok { background: #e8f5e9; color: #2e7d32; }
    .badge.non { background: #ffebee; color: #c62828; }
    .badge.admin { background: #e3f2fd; color: #1565c0; }
    .btn { padding: 0.35rem 0.8rem; border: none; border-radius: 5px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }
    .btn-approve { background: #e8f5e9; color: #2e7d32; }
    .btn-reject { background: #ffebee; color: #c62828; }
    .btn-delete { background: #ffebee; color: #c62828; }
    .actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; }
    .empty { text-align: center; padding: 3rem; color: #888; }
    table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; }
    th { background: #1a5c2a; color: #fff; padding: 0.6rem 0.8rem; text-align: left; font-size: 0.85rem; }
    td { padding: 0.6rem 0.8rem; border-bottom: 1px solid #eee; font-size: 0.85rem; }
  `]
})
export class AdminPanelComponent implements OnInit {
  onglet: 'forum' | 'apprentissage' | 'utilisateurs' = 'forum';
  articles: ArticleForum[] = [];
  apprentissages: ContenuApprentissage[] = [];
  utilisateurs: Utilisateur[] = [];

  constructor(
    private forumService: ForumService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.forumService.getArticles().subscribe(data => this.articles = data);
    this.forumService.getApprentissages().subscribe(data => this.apprentissages = data);
    this.utilisateurService.getAll().subscribe(data => this.utilisateurs = data);
  }

  moderer(id: string, estModere: boolean) {
    this.forumService.modererArticle(id, estModere).subscribe(() => {
      this.forumService.getArticles().subscribe(data => this.articles = data);
    });
  }

  validerApprentissage(id: string) {
    this.forumService.validerContenu(id).subscribe(() => {
      this.forumService.getApprentissages().subscribe(data => this.apprentissages = data);
    });
  }

  supprimerUtilisateur(id: string) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUser(id).subscribe(() => {
        this.utilisateurService.getAll().subscribe(data => this.utilisateurs = data);
      });
    }
  }
}
