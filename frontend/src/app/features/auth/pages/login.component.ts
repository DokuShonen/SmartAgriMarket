import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastComponent } from '../../../core/components/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, RouterLink, FormsModule, ToastComponent],
  template: `
    <div class="auth-page">
      <a routerLink="/" class="back-btn">
        <span class="material-icons-outlined">arrow_back</span>
      </a>

      <div class="form-section">
        <div class="form-inner">
          <div class="logo-wrap">
            <img src="assets/logo.png" alt="SmartAgriMarket" class="logo" />
          </div>

          <div class="hero">
            <h1>Bienvenue</h1>
            <p>Connectez-vous pour continuer</p>
          </div>

          <form (ngSubmit)="submit()" #form="ngForm" class="auth-form">
            <div class="field">
              <label for="email">Email</label>
              <div class="input-wrap">
                <span class="material-icons-outlined">mail_outline</span>
                <input type="email" id="email" [(ngModel)]="email" name="email" required email placeholder="votre@email.com" autocomplete="email" />
              </div>
            </div>

            <div class="field">
              <label for="password">Mot de passe</label>
                <div class="input-wrap">
                  <span class="material-icons-outlined">lock_outline</span>
                  <input [attr.type]="showPassword ? 'text' : 'password'" id="password" [(ngModel)]="motDePasse" name="motDePasse" required placeholder="Mot de passe" autocomplete="current-password" />
                  <button type="button" class="pwd-toggle" (click)="showPassword = !showPassword" [attr.aria-label]="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'">
                    <span class="material-icons-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
            </div>

            <div class="forgot-row">
              <a routerLink="/mot-de-passe-oublie">Mot de passe oublie ?</a>
            </div>

            <div class="error-msg" *ngIf="erreur" role="alert">
              <span class="material-icons-outlined">error_outline</span>
              {{ erreur }}
            </div>

            <button type="submit" class="btn-primary" [disabled]="enCours || !form.valid">
              <span class="material-icons-outlined" *ngIf="!enCours">arrow_forward</span>
              <span class="spinner" *ngIf="enCours"></span>
              {{ enCours ? 'Connexion...' : 'Se connecter' }}
            </button>
          </form>

          <div class="footer">
            <p class="switch-link">Pas encore de compte ? <a routerLink="/inscription">Creer un compte</a></p>
            <div class="trust">
              <span class="material-icons-outlined">shield</span>
              <span>Connexion securisee</span>
            </div>
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
          <span class="material-icons-outlined deco-i d1" aria-hidden="true">grass</span>
          <span class="material-icons-outlined deco-i d2" aria-hidden="true">eco</span>
          <span class="material-icons-outlined deco-i d3" aria-hidden="true">local_florist</span>
          <span class="material-icons-outlined deco-i d4" aria-hidden="true">spa</span>
          <span class="material-icons-outlined deco-i d5" aria-hidden="true">park</span>
          <span class="material-icons-outlined deco-i d6" aria-hidden="true">agriculture</span>
        </div>
        <div class="illust-text">
          <img src="assets/logo.png" alt="SmartAgriMarket" class="illust-logo" />
          <h2>Smart<span>Agri</span>Market</h2>
          <p>Le marche agricole qui connecte producteurs et acheteurs en toute simplicite</p>
          <div class="stats">
            <div class="stat"><span class="stat-num">500+</span><span class="stat-label">Producteurs</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-num">2000+</span><span class="stat-label">Transactions</span></div>
            <div class="stat-sep"></div>
            <div class="stat"><span class="stat-num">50+</span><span class="stat-label">Localites</span></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      display: flex;
      min-height: 100dvh;
      background: #fff;
    }

    /* === BACK BTN === */
    .back-btn {
      position: fixed;
      top: 56px;
      left: 12px;
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      color: var(--heading-color);
      text-decoration: none;
      z-index: 20;
    }
    .back-btn:active { background: var(--n-100); }

    .back-btn:hover { background: var(--n-100); }

    /* === FORM SECTION === */
    .form-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    }

    .form-inner {
      width: 100%;
      max-width: 400px;
      margin: 0 auto;
    }

    .logo-wrap {
      display: flex;
      justify-content: center;
      margin-bottom: 32px;
    }
    .logo {
      width: 64px;
      height: 64px;
      object-fit: contain;
    }

    .hero {
      text-align: center;
      margin-bottom: 36px;
    }
    .hero h1 {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 6px;
    }
    .hero p {
      font-size: 15px;
      color: var(--text-secondary);
    }

    .field {
      margin-bottom: 18px;
    }
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
    .input-wrap .material-icons-outlined {
      font-size: 20px;
      width: 20px;
      text-align: center;
      margin-right: 8px;
      color: var(--text-dim);
      flex-shrink: 0;
    }
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
    .input-wrap input:-webkit-autofill {
      padding: 16px 0 !important;
      -webkit-box-shadow: 0 0 0 1000px var(--g-50) inset !important;
      box-shadow: 0 0 0 1000px var(--g-50) inset !important;
      -webkit-text-fill-color: var(--heading-color) !important;
      caret-color: var(--heading-color);
      background-clip: content-box !important;
    }
    .input-wrap:focus-within input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
      box-shadow: 0 0 0 1000px #fff inset !important;
    }
    input::-webkit-credentials-auto-fill-button,
    input::-webkit-strong-password-auto-fill-button {
      visibility: hidden;
      display: none !important;
      pointer-events: none;
    }
    .pwd-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      background: none;
      border: none;
      padding: 0 4px;
      cursor: pointer;
      color: var(--text-dim);
      flex-shrink: 0;
      font-size: 20px;
      line-height: 1;
      transition: color 0.2s;
    }
    .pwd-toggle:hover { color: var(--heading-color); }

    .forgot-row {
      text-align: right;
      margin: -10px 0 16px;
    }
    .forgot-row a {
      font-size: 13px;
      font-weight: 600;
      color: var(--brand);
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .forgot-row a:hover { opacity: 0.75; }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      font-size: 13px;
      color: #dc2626;
      margin-bottom: 16px;
    }
    .error-msg .material-icons-outlined { font-size: 18px; flex-shrink: 0; }

    .btn-primary {
      width: 100%;
      padding: 16px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: 14px;
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      min-height: 54px;
      box-shadow: 0 4px 20px rgba(39, 163, 55, 0.3);
      transition: transform 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary:hover { background: var(--brand-dark); box-shadow: 0 6px 24px rgba(39, 163, 55, 0.35); }
    .btn-primary:disabled { opacity: 0.45; box-shadow: none; cursor: default; transform: none; }
    .btn-primary .material-icons-outlined { font-size: 20px; }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .footer {
      margin-top: auto;
      padding-top: 24px;
      text-align: center;
    }
    .switch-link {
      font-size: 14px;
      color: var(--text-secondary);
      margin-bottom: 16px;
    }
    .switch-link a {
      color: var(--brand);
      font-weight: 700;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .switch-link a:hover { opacity: 0.75; }
    .trust {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: var(--g-50);
      border-radius: 100px;
      font-size: 12px;
      color: var(--text-dim);
    }
    .trust .material-icons-outlined { font-size: 14px; color: var(--brand); }

    /* === ILLUSTRATION PANEL (desktop) === */
    .illust-section {
      display: none;
    }

    @media (min-width: 900px) {
      .back-btn { display: none; }

      .form-section {
        order: 2;
        padding: 64px 48px;
        padding-top: 64px;
      }

      .form-inner {
        max-width: 400px;
      }

      .logo { width: 56px; height: 56px; }
      .logo-wrap { margin-bottom: 28px; }
      .hero { margin-bottom: 32px; }
      .hero h1 { font-size: 1.75rem; }

      .illust-section {
        order: 1;
        display: flex;
        flex: 1;
        min-height: 100dvh;
        position: relative;
        background: linear-gradient(160deg, #1a5c2a 0%, #0d3a18 40%, #0a2e13 100%);
        overflow: hidden;
        align-items: center;
        justify-content: center;
      }
      .illust-bg { position: absolute; inset: 0; }
      .circle {
        position: absolute;
        border-radius: 50%;
        border: 1.5px solid rgba(255,255,255,0.08);
      }
      .c1 { width: 400px; height: 400px; top: -100px; right: -100px; }
      .c2 { width: 250px; height: 250px; bottom: -60px; left: -40px; }
      .c3 { width: 180px; height: 180px; top: 40%; left: 30%; border-color: rgba(39,163,55,0.15); }

      .illust-icons { position: absolute; inset: 0; pointer-events: none; }
      .deco-i { position: absolute; color: rgba(255,255,255,0.06); font-size: 2.5rem; }
      .d1 { top: 12%; left: 10%; transform: rotate(-20deg); font-size: 3rem; }
      .d2 { top: 25%; right: 15%; transform: rotate(15deg); }
      .d3 { bottom: 35%; left: 8%; transform: rotate(10deg); font-size: 3rem; }
      .d4 { top: 60%; right: 12%; transform: rotate(-10deg); }
      .d5 { bottom: 15%; right: 25%; transform: rotate(20deg); font-size: 3rem; }
      .d6 { bottom: 8%; left: 25%; transform: rotate(-5deg); }

      .illust-text {
        position: relative;
        z-index: 1;
        text-align: center;
        padding: 60px 40px;
        width: 100%;
      }
      .illust-logo {
        display: block;
        margin: 0 auto 32px;
        width: 88px;
        height: 88px;
        object-fit: contain;
        filter: drop-shadow(0 8px 24px rgba(0,0,0,0.3));
      }
      .illust-text h2 {
        font-family: var(--font-display);
        font-size: 2rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 12px;
      }
      .illust-text h2 span { color: #6cd97e; }
      .illust-text p {
        font-size: 15px;
        color: rgba(255,255,255,0.6);
        max-width: 340px;
        margin: 0 auto;
        line-height: 1.5;
      }
      .stats {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 24px;
        margin-top: 48px;
        padding-top: 32px;
        border-top: 1px solid rgba(255,255,255,0.1);
      }
      .stat { text-align: center; }
      .stat-num {
        display: block;
        font-family: var(--font-display);
        font-size: 1.5rem;
        font-weight: 700;
        color: #6cd97e;
      }
      .stat-label {
        font-size: 12px;
        color: rgba(255,255,255,0.45);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .stat-sep { width: 1px; height: 32px; background: rgba(255,255,255,0.1); }
    }
  `]
})
export class LoginComponent {
  email = '';
  motDePasse = '';
  showPassword = false;
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
      next: (r) => {
        const u = r.utilisateur;
        ToastComponent.show(`Bienvenue ${u.prenom} !`, 'success');
        setTimeout(() => {
          if (u.type === 'ADMIN' || u.type === 'SUPER_ADMIN' || u.type === 'MODERATION_SUPPORT') this.router.navigate(['/admin']);
          else if (u.type === 'PRODUCTEUR') this.router.navigate(['/produits/dashboard']);
          else if (u.type === 'AGENT_RELAIS') this.router.navigate(['/agent-relais']);
          else this.router.navigate(['/produits']);
        }, 800);
      },
      error: (err) => {
        this.enCours = false;
        this.erreur = err.error?.error || 'Email ou mot de passe incorrect';
      }
    });
  }
}
