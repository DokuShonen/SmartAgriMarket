import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnonceMaterielService } from '../../../../core/services/annonce-materiel.service';

@Component({
  selector: 'app-form-materiel',
  standalone: true,
  imports: [NgIf, RouterLink, FormsModule],
  template: `
    <div class="form-container">
      <a routerLink="/materiel" class="back-link">← Retour</a>
      <h2>Nouvelle annonce matériel</h2>
      <form (ngSubmit)="submit()" #form="ngForm">
        <div class="form-group">
          <label>Titre *</label>
          <input type="text" [(ngModel)]="titre" name="titre" required />
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="description" name="description" rows="3"></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Type *</label>
            <select [(ngModel)]="typeTransaction" name="typeTransaction" required>
              <option value="VENTE">Vente</option>
              <option value="ECHANGE">Échange / Troc</option>
            </select>
          </div>
          <div class="form-group">
            <label>État *</label>
            <select [(ngModel)]="etat" name="etat" required>
              <option value="NEUF">Neuf</option>
              <option value="OCCASION">Occasion</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Prix (FCFA, optionnel)</label>
          <input type="number" [(ngModel)]="prix" name="prix" min="0" />
        </div>
        <div class="form-group">
          <label>Localité *</label>
          <input type="text" [(ngModel)]="localite" name="localite" required />
        </div>
        <button type="submit" class="btn-submit" [disabled]="enCours || !form.valid">
          {{ enCours ? 'Publication...' : 'Publier l\'annonce' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .form-container { max-width: 520px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; }
    h2 { font-size: 1.4rem; margin: 0.75rem 0 1.25rem; }
    form { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1.25rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; flex: 1; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; font-family: inherit; }
    .form-row { display: flex; gap: 1rem; }
    .btn-submit { width: 100%; padding: 0.8rem; background: #1a5c2a; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; margin-top: 0.5rem; }
    .btn-submit:hover { background: #2e7d32; }
    .btn-submit:disabled { opacity: 0.5; cursor: default; }
  `]
})
export class FormMaterielComponent {
  titre = '';
  description = '';
  prix = 0;
  typeTransaction = 'VENTE';
  etat = 'OCCASION';
  localite = '';
  enCours = false;

  constructor(
    private service: AnnonceMaterielService,
    private router: Router
  ) {}

  submit() {
    if (this.enCours) return;
    this.enCours = true;
    this.service.create({
      titre: this.titre,
      description: this.description,
      prix: this.prix || null,
      typeTransaction: this.typeTransaction,
      etat: this.etat,
      localite: this.localite
    }).subscribe({
      next: () => this.router.navigate(['/materiel']),
      error: () => { this.enCours = false; alert('Erreur'); }
    });
  }
}
