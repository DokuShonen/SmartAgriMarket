import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumService } from '../../../../core/services/forum.service';
import { ToastComponent } from '../../../../core/components/toast.component';

@Component({
  selector: 'app-forum-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, RouterLink],
  template: `
    <form (ngSubmit)="submit()" #form="ngForm" class="forum-form">
      <div class="form-group">
        <label>Titre *</label>
        <input type="text" [(ngModel)]="titre" name="titre" required placeholder="Titre de votre message" />
      </div>
      <div class="form-group">
        <label>Catégorie</label>
        <select [(ngModel)]="categorie" name="categorie">
          <option value="">Général</option>
          <option value="Marché">Marché</option>
          <option value="Conseils">Conseils</option>
          <option value="Cultures">Cultures</option>
          <option value="Entraide">Entraide</option>
          <option value="Maladies">Maladies</option>
          <option value="Logistique">Logistique</option>
          <option value="Financement">Financement</option>
          <option value="Recettes">Recettes</option>
        </select>
      </div>
      <div class="form-group">
        <label>Message *</label>
        <textarea [(ngModel)]="contenu" name="contenu" rows="6" required placeholder="Partagez votre expérience, question ou conseil..."></textarea>
      </div>
      <p class="form-note">
        <span class="material-icons-outlined">info</span>
        Les numéros de téléphone, emails et URL sont automatiquement masqués.
      </p>
      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="cancelled.emit()" *ngIf="isModal">Annuler</button>
        <button type="submit" class="btn-submit" [disabled]="enCours || !form.valid">
          <span class="material-icons-outlined" *ngIf="!enCours">send</span>
          {{ enCours ? 'Publication...' : 'Publier' }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .forum-form { padding: 0.5rem 0; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); }
    .form-group input, .form-group select, .form-group textarea { padding: 0.65rem 0.75rem; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 0.88rem; background: #fafafa; transition: border-color 0.2s; font-family: inherit; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--green-500); background: #fff; }
    .form-note { display: flex; align-items: center; gap: 0.3rem; font-size: 0.78rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
    .form-note .material-icons-outlined { font-size: 0.9rem; color: var(--green-600); }
    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
    .btn-cancel { padding: 0.6rem 1.2rem; border: 1px solid #e5e5e5; background: #fff; border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
    .btn-cancel:hover { background: #f5f5f5; }
    .btn-submit { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.5rem; background: var(--green-700); color: #fff; border: none; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-submit:hover { background: var(--green-800); }
    .btn-submit:disabled { opacity: 0.5; }
    .btn-submit .material-icons-outlined { font-size: 0.95rem; }
  `]
})
export class ForumFormComponent {
  @Input() editId: string | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get isModal(): boolean { return !!this.saved.observers.length; }

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
      categorie: this.categorie || 'Général',
      contenu: this.contenu
    }).subscribe({
      next: () => {
        ToastComponent.show('Message publié avec succès !', 'success');
        if (this.isModal) {
          this.saved.emit();
        } else {
          this.router.navigate(['/forum']);
        }
      },
      error: () => { this.enCours = false; ToastComponent.show('Erreur lors de la publication', 'error'); }
    });
  }
}
