import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../../core/services/forum.service';

@Component({
  selector: 'app-forum-form',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink],
  template: `
    <div class="form-container">
      <a routerLink="/forum" class="back-link">← Retour</a>
      <h2>Publier un article</h2>
      <form (ngSubmit)="submit()" #form="ngForm">
        <div class="form-group">
          <label>Titre *</label>
          <input type="text" [(ngModel)]="titre" name="titre" required />
        </div>
        <div class="form-group">
          <label>Catégorie *</label>
          <select [(ngModel)]="categorie" name="categorie" required>
            <option value="">Sélectionner...</option>
            <option value="Agriculture">Agriculture</option>
            <option value="Élevage">Élevage</option>
            <option value="Commerce">Commerce</option>
            <option value="Astuces">Astuces</option>
            <option value="Questions">Questions</option>
          </select>
        </div>
        <div class="form-group">
          <label>Contenu *</label>
          <textarea [(ngModel)]="contenu" name="contenu" rows="6" required></textarea>
        </div>
        <button type="submit" class="btn-submit" [disabled]="enCours || !form.valid">
          {{ enCours ? 'Publication...' : 'Publier' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-container { max-width: 600px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; }
    h2 { margin: 0.75rem 0 1.25rem; }
    form { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; font-family: inherit; }
    .btn-submit { width: 100%; padding: 0.8rem; background: #1a5c2a; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; }
    .btn-submit:hover { background: #2e7d32; }
    .btn-submit:disabled { opacity: 0.5; cursor: default; }
  `]
})
export class ForumFormComponent {
  titre = '';
  categorie = '';
  contenu = '';
  enCours = false;

  constructor(
    private forumService: ForumService,
    private router: Router
  ) {}

  submit() {
    if (this.enCours) return;
    this.enCours = true;
    this.forumService.createArticle({
      titre: this.titre,
      categorie: this.categorie,
      contenu: this.contenu
    }).subscribe({
      next: () => this.router.navigate(['/forum']),
      error: () => { this.enCours = false; alert('Erreur'); }
    });
  }
}
