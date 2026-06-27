import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, RouterLink, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Créer un compte</h2>
        <p class="sub">Rejoignez la communauté SmartAgriMarket</p>
        <form (ngSubmit)="submit()" #form="ngForm">
          <div class="form-row">
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" [(ngModel)]="prenom" name="prenom" required />
            </div>
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" [(ngModel)]="nom" name="nom" required />
            </div>
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input type="email" [(ngModel)]="email" name="email" required email />
          </div>
          <div class="form-group">
            <label>Téléphone *</label>
            <input type="tel" [(ngModel)]="telephone" name="telephone" required />
          </div>
          <div class="form-group">
            <label>Localité *</label>
            <input type="text" [(ngModel)]="localite" name="localite" required />
          </div>
          <div class="form-group">
            <label>Type de compte *</label>
            <select [(ngModel)]="type" name="type" required>
              <option value="PRODUCTEUR">Producteur / Agriculteur</option>
              <option value="ACHETEUR">Acheteur</option>
              <option value="AGENT_RELAIS">Agent relais</option>
            </select>
          </div>
          <div class="form-group">
            <label>Mot de passe *</label>
            <input type="password" [(ngModel)]="motDePasse" name="motDePasse" required minlength="6" />
          </div>
          <p class="erreur" *ngIf="erreur">{{ erreur }}</p>
          <button type="submit" class="btn-submit" [disabled]="enCours || !form.valid">
            {{ enCours ? 'Inscription...' : 'Créer mon compte' }}
          </button>
        </form>
        <p class="switch">Déjà inscrit ? <a routerLink="/connexion">Se connecter</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
    .auth-card { width: 100%; max-width: 480px; background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 2rem; }
    h2 { text-align: center; margin-bottom: 0.25rem; }
    .sub { text-align: center; color: #888; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
    .form-group input, .form-group select { padding: 0.65rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; }
    .erreur { color: #c62828; font-size: 0.85rem; text-align: center; margin-bottom: 0.5rem; }
    .btn-submit { width: 100%; padding: 0.8rem; background: #1a5c2a; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; }
    .btn-submit:hover { background: #2e7d32; }
    .btn-submit:disabled { opacity: 0.5; }
    .switch { text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666; }
    .switch a { color: #1a5c2a; }
  `]
})
export class RegisterComponent {
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  localite = '';
  motDePasse = '';
  type = 'PRODUCTEUR';
  enCours = false;
  erreur = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit() {
    if (this.enCours) return;
    this.enCours = true;
    this.erreur = '';

    this.authService.register({
      nom: this.nom, prenom: this.prenom, email: this.email,
      telephone: this.telephone, motDePasse: this.motDePasse,
      localite: this.localite, type: this.type
    }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.enCours = false;
        this.erreur = err.error?.message || 'Erreur lors de l\'inscription';
      }
    });
  }
}
