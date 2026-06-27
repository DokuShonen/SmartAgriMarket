import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, SlicePipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../../core/services/forum.service';
import { ArticleForum, ContenuApprentissage } from '../../../../core/models/article-forum.model';

@Component({
  selector: 'app-forum-liste',
  standalone: true,
  imports: [NgFor, NgIf, SlicePipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './forum-liste.component.html',
  styleUrls: ['./forum-liste.component.css']
})
export class ForumListeComponent implements OnInit {
  articles: ArticleForum[] = [];
  apprentissages: ContenuApprentissage[] = [];
  filtreCategorie = '';
  onglet: 'forum' | 'apprentissage' = 'forum';

  constructor(private forumService: ForumService) {}

  ngOnInit() {
    this.forumService.getArticles().subscribe(data => this.articles = data);
    this.forumService.getApprentissages().subscribe(data => this.apprentissages = data);
  }

  get articlesFiltres(): ArticleForum[] {
    if (!this.filtreCategorie) return this.articles;
    return this.articles.filter(a => a.categorie === this.filtreCategorie);
  }

  get categories(): string[] {
    return [...new Set(this.articles.map(a => a.categorie))];
  }
}
