import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastComponent } from '../../../core/components/toast.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [NgIf, RouterLink, FormsModule, ToastComponent],
  template: `
    <div class="auth-page">
      <a routerLink="/connexion" class="back-btn">
        <span class="material-icons-outlined">arrow_back</span>
      </a>

      <div class="form-section">
        <div class="form-inner">
          <div class="logo-wrap">
            <img src="assets/logo.png" alt="" class="logo" />
          </div>

          <div class="hero">
            <h1>Mot de passe oublie</h1>
            <p>Saisissez votre email pour recevoir un lien de reinitialisation</p>
          </div>

          <form (ngSubmit)="submit()" #form="ngForm" class="auth-form">
            <div class="field">
              <label for="email">Email</label>
              <div class="input-wrap">
                <span class="material-icons-outlined">mail_outline</span>
                <input type="email" id="email" [(ngModel)]="email" name="email" required email placeholder="votre@email.com" autocomplete="email" />
              </div>
            </div>

            <div class="error-msg" *ngIf="erreur">
              <span class="material-icons-outlined">error_outline</span>
              {{ erreur }}
            </div>
            <div class="success-msg" *ngIf="succes">
              <span class="material-icons-outlined">check_circle</span>
              {{ succes }}
            </div>

            <button type="submit" class="btn-primary" [disabled]="enCours || !form.valid">
              <span class="spinner" *ngIf="enCours"></span>
              {{ enCours ? 'Envoi...' : 'Envoyer le lien' }}
            </button>
          </form>

          <div class="footer">
            <p class="switch-link"><a routerLink="/connexion">Retour a la connexion</a></p>
          </div>
        </div>
      </div>

      <div class="illust-section">
        <div class="illust-bg">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
          <div class="circle c3"></div>
        </div>
        <div class="illust-icons">
          <span class="material-icons-outlined deco-i d1">lock_reset</span>
          <span class="material-icons-outlined deco-i d2">security</span>
          <span class="material-icons-outlined deco-i d3">verified_user</span>
        </div>
        <div class="illust-text">
          <img src="assets/logo.png" alt="" class="illust-logo" />
          <h2>Smart<span>Agri</span>Market</h2>
          <p>Reinitialisez votre mot de passe en toute securite</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: contents; }
    .auth-page {
      display: flex;
      min-height: 100dvh;
      background: #fff;
    }
    .back-btn {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 10;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--g-50);
      color: var(--heading-color);
      text-decoration: none;
      transition: background 0.2s;
    }
    .back-btn:hover { background: var(--g-100); }
    .back-btn .material-icons-outlined { font-size: 22px; }

    .form-section {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
    }
    .form-inner {
      width: 100%;
      max-width: 380px;
    }
    .logo-wrap {
      text-align: center;
      margin-bottom: 8px;
    }
    .logo { height: 48px; }
    .hero {
      text-align: center;
      margin-bottom: 28px;
    }
    .hero h1 {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      color: var(--heading-color);
      margin: 0 0 6px;
    }
    .hero p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
    }

    .field { margin-bottom: 18px; }
    .field label {
      display: block;
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 8px;
    }
    .input-wrap {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 0 12px;
      background: var(--g-50);
      border: 1.5px solid var(--n-200);
      border-radius: 14px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .input-wrap:focus-within {
      border-color: var(--brand);
      background: #fff;
      box-shadow: 0 0 0 4px rgba(39, 163, 55, 0.08);
    }
    .input-wrap .material-icons-outlined { font-size: 20px; width: 20px; text-align: center; margin-right: 8px; color: var(--text-dim); flex-shrink: 0; }
    .input-wrap input {
      flex: 1;
      min-width: 0;
      border: none;
      background: transparent;
      padding: 16px 0 !important;
      font-size: 16px;
      color: var(--heading-color);
      outline: none;
      text-align: left;
    }
    .input-wrap input::placeholder { color: var(--n-400); }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #d32f2f;
      background: #fef2f2;
      padding: 10px 14px;
      border-radius: 10px;
      margin-bottom: 16px;
    }
    .error-msg .material-icons-outlined { font-size: 18px; flex-shrink: 0; }

    .success-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--brand);
      background: #f0fdf4;
      padding: 10px 14px;
      border-radius: 10px;
      margin-bottom: 16px;
    }
    .success-msg .material-icons-outlined { font-size: 18px; flex-shrink: 0; }

    .btn-primary {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: var(--brand);
      color: #fff;
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: opacity 0.2s;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: default; }
    .btn-primary:not(:disabled):hover { opacity: 0.9; }
    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .footer { text-align: center; margin-top: 20px; }
    .switch-link { font-size: 14px; color: var(--text-secondary); margin: 0; }
    .switch-link a {
      color: var(--brand);
      font-weight: 600;
      text-decoration: none;
    }
    .switch-link a:hover { text-decoration: underline; }

    .illust-section {
      display: none;
      width: 480px;
      background: linear-gradient(135deg, var(--g-50), #e8f5e9);
      position: relative;
      overflow: hidden;
    }
    .illust-bg { position: absolute; inset: 0; }
    .circle {
      position: absolute;
      border-radius: 50%;
      opacity: 0.5;
    }
    .circle.c1 { width: 340px; height: 340px; background: var(--brand); top: -80px; right: -80px; opacity: 0.08; }
    .circle.c2 { width: 220px; height: 220px; background: var(--brand); bottom: 60px; left: -50px; opacity: 0.06; }
    .circle.c3 { width: 160px; height: 160px; background: var(--brand); top: 50%; left: 50%; transform: translate(-50%,-50%); opacity: 0.04; }
    .illust-icons {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
    }
    .illust-icons .material-icons-outlined {
      font-size: 64px;
      color: var(--brand);
      opacity: 0.15;
    }
    .illust-text {
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      width: 80%;
    }
    .illust-logo { height: 40px; margin-bottom: 8px; }
    .illust-text h2 {
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 700;
      color: var(--heading-color);
      margin: 0 0 8px;
    }
    .illust-text h2 span { color: var(--brand); }
    .illust-text p {
      font-size: 14px;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.5;
    }

    @media (min-width: 900px) {
      .illust-section { display: flex; }
    }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  enCours = false;
  erreur = '';
  succes = '';

  constructor(private authService: AuthService) {}

  submit() {
    if (this.enCours) return;
    this.enCours = true;
    this.erreur = '';
    this.succes = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.succes = 'Si cet email est associe a un compte, un lien de reinitialisation vous a ete envoye.';
        this.enCours = false;
      },
      error: () => {
        this.succes = 'Si cet email est associe a un compte, un lien de reinitialisation vous a ete envoye.';
        this.enCours = false;
      }
    });
  }
}
