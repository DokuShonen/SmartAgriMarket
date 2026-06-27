import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, RouterLink, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Connexion</h2>
        <p class="sub">Connectez-vous pour accéder à votre espace</p>
        <form (ngSubmit)="submit()" #form="ngForm">
          <div class="form-group">
            <label>Email *</label>
            <input type="email" [(ngModel)]="email" name="email" required email />
          </div>
          <div class="form-group">
            <label>Mot de passe *</label>
            <input type="password" [(ngModel)]="motDePasse" name="motDePasse" required />
          </div>
          <p class="erreur" *ngIf="erreur">{{ erreur }}</p>
          <button type="submit" class="btn-submit" [disabled]="enCours || !form.valid">
            {{ enCours ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>
        <p class="switch">Pas encore de compte ? <a routerLink="/inscription">Créer un compte</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1rem; }
    .auth-card { width: 100%; max-width: 400px; background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 2rem; }
    h2 { text-align: center; margin-bottom: 0.25rem; }
    .sub { text-align: center; color: #888; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
    .form-group input { padding: 0.65rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.95rem; }
    .erreur { color: #c62828; font-size: 0.85rem; text-align: center; margin-bottom: 0.5rem; }
    .btn-submit { width: 100%; padding: 0.8rem; background: #1a5c2a; color: #fff; border: none; border-radius: 8px; font-size: 1rem; font-weight: 700; cursor: pointer; }
    .btn-submit:hover { background: #2e7d32; }
    .btn-submit:disabled { opacity: 0.5; }
    .switch { text-align: center; margin-top: 1rem; font-size: 0.9rem; color: #666; }
    .switch a { color: #1a5c2a; }
  `]
})
export class LoginComponent {
  email = '';
  motDePasse = '';
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

    this.authService.login({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.enCours = false;
        this.erreur = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}
