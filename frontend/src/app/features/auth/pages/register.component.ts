import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastComponent } from '../../../core/components/toast.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink, FormsModule, ToastComponent],
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

          <!-- STEP PROGRESS -->
          <div class="step-bar" *ngIf="step > 1">
            <div class="step-dot" [class.active]="step >= 2" [class.done]="step > 2">
              <span *ngIf="step <= 2">1</span>
              <span class="material-icons-outlined" *ngIf="step > 2">check</span>
            </div>
            <div class="step-line" [class.filled]="step >= 3"></div>
            <div class="step-dot" [class.active]="step >= 3">
              <span>2</span>
            </div>
            <div class="step-line" [class.filled]="step >= 4"></div>
            <div class="step-dot" [class.active]="step >= 4">
              <span>3</span>
            </div>
          </div>

          <!-- STEP 1: TYPE -->
          <div *ngIf="step === 1" class="step-body">
            <div class="hero">
              <h1>Vous etes ?</h1>
              <p>Choisissez votre type de compte</p>
            </div>
            <div class="type-grid">
              <button class="type-card" [class.selected]="type === 'PRODUCTEUR'" (click)="type = 'PRODUCTEUR'" [attr.aria-pressed]="type === 'PRODUCTEUR'">
                <span class="material-icons-outlined">grass</span>
                <strong>Producteur</strong>
                <span class="type-desc">Vendre mes produits</span>
              </button>
              <button class="type-card" [class.selected]="type === 'ACHETEUR'" (click)="type = 'ACHETEUR'" [attr.aria-pressed]="type === 'ACHETEUR'">
                <span class="material-icons-outlined">shopping_cart</span>
                <strong>Acheteur</strong>
                <span class="type-desc">Acheter des produits</span>
              </button>
              <button class="type-card" [class.selected]="type === 'AGENT_RELAIS'" (click)="type = 'AGENT_RELAIS'" [attr.aria-pressed]="type === 'AGENT_RELAIS'">
                <span class="material-icons-outlined">groups</span>
                <strong>Agent relais</strong>
                <span class="type-desc">Accompagner</span>
              </button>
            </div>
            <button class="btn-primary" (click)="step = 2" [disabled]="!type">
              <span class="material-icons-outlined">arrow_forward</span>
              Suivant
            </button>
          </div>

          <!-- STEP 2: INFOS -->
          <div *ngIf="step === 2" class="step-body">
            <div class="hero">
              <h1>Vos informations</h1>
              <p>Completez votre profil</p>
            </div>
            <div class="auth-form">
              <div class="field-row">
                <div class="field"><label>Prenom</label><input type="text" [(ngModel)]="prenom" name="prenom" required placeholder="Prenom" /></div>
                <div class="field"><label>Nom</label><input type="text" [(ngModel)]="nom" name="nom" required placeholder="Nom" /></div>
              </div>
              <div class="field">
                <label>Email</label>
                <div class="input-wrap">
                  <span class="material-icons-outlined">mail_outline</span>
                  <input type="email" [(ngModel)]="email" name="email" required email placeholder="votre@email.com" />
                </div>
              </div>
              <div class="field-row">
                <div class="field"><label>Telephone</label><input type="tel" [(ngModel)]="telephone" name="telephone" required placeholder="+226 XX" /></div>
                <div class="field"><label>Localite</label><input type="text" [(ngModel)]="localite" name="localite" required placeholder="Ville" /></div>
              </div>
              <div class="vendor-section" *ngIf="type === 'PRODUCTEUR'">
                <div class="vendor-label">
                  <span class="material-icons-outlined">storefront</span> Informations vendeur
                </div>
                <div class="field"><label>Numero CNIB</label><input type="text" [(ngModel)]="cnib" name="cnib" placeholder="Numero CNIB" /></div>
                <div class="field"><label>Cooperative</label><input type="text" [(ngModel)]="cooperative" name="cooperative" placeholder="Nom de votre cooperative" /></div>
              </div>
            </div>
            <div class="btn-row">
              <button class="btn-secondary" (click)="step = 1">
                <span class="material-icons-outlined">arrow_back</span> Retour
              </button>
              <button class="btn-primary" (click)="step = 3" [disabled]="!prenom || !nom || !email || !telephone || !localite">
                <span class="material-icons-outlined">arrow_forward</span> Suivant
              </button>
            </div>
          </div>

          <!-- STEP 3: MDP -->
          <div *ngIf="step === 3" class="step-body">
            <div class="hero">
              <h1>Securite</h1>
              <p>Choisissez votre mot de passe</p>
            </div>
            <div class="auth-form">
              <div class="field">
                <label>Mot de passe</label>
                <div class="input-wrap">
                  <span class="material-icons-outlined">lock_outline</span>
                  <input [attr.type]="showPassword ? 'text' : 'password'" [(ngModel)]="motDePasse" name="motDePasse" required minlength="6" placeholder="Minimum 6 caracteres" autocomplete="new-password" />
                  <button type="button" class="pwd-toggle" (click)="showPassword = !showPassword" [attr.aria-label]="showPassword ? 'Masquer' : 'Afficher'">
                    <span class="material-icons-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
                  </button>
                </div>
              </div>
              <div class="error-msg" *ngIf="erreur" role="alert">
                <span class="material-icons-outlined">error_outline</span>
                {{ erreur }}
              </div>
            </div>
            <div class="btn-row">
              <button class="btn-secondary" (click)="step = 2">
                <span class="material-icons-outlined">arrow_back</span> Retour
              </button>
              <button class="btn-primary" (click)="submit()" [disabled]="enCours || !motDePasse || motDePasse.length < 6">
                <span class="material-icons-outlined" *ngIf="!enCours">check_circle</span>
                <span class="spinner" *ngIf="enCours"></span>
                {{ enCours ? 'Inscription...' : 'Creer mon compte' }}
              </button>
            </div>
          </div>

          <div class="footer">
            <p class="switch-link">Deja inscrit ? <a routerLink="/connexion">Se connecter</a></p>
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
          <h2>Rejoignez <span>SmartAgri</span></h2>
          <p>Accedez a un reseau direct producteurs-acheteurs</p>
          <div class="steps-list">
            <div class="s-item"><div class="s-icon"><span class="material-icons-outlined">how_to_reg</span></div><span>Completez votre profil</span></div>
            <div class="s-arrow"><span class="material-icons-outlined">south</span></div>
            <div class="s-item"><div class="s-icon"><span class="material-icons-outlined">storefront</span></div><span>Achetez ou vendez</span></div>
            <div class="s-arrow"><span class="material-icons-outlined">south</span></div>
            <div class="s-item"><div class="s-icon"><span class="material-icons-outlined">local_shipping</span></div><span>Livraison assuree</span></div>
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

    /* === FORM === */
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
      margin-bottom: 24px;
    }
    .logo { width: 56px; height: 56px; object-fit: contain; }

    .hero { text-align: center; margin-bottom: 28px; }
    .hero h1 {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 4px;
    }
    .hero p { font-size: 14px; color: var(--text-secondary); }

    /* === STEP BAR === */
    .step-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 24px;
      padding: 14px 20px;
      background: var(--g-50);
      border-radius: 14px;
    }
    .step-dot {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background: var(--n-200);
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--text-secondary);
      flex-shrink: 0;
      transition: all 0.3s;
    }
    .step-dot .material-icons-outlined { font-size: 16px; }
    .step-dot.active, .step-dot.done {
      background: var(--brand);
      color: #fff;
    }
    .step-line {
      flex: 1;
      height: 3px;
      background: var(--n-200);
      border-radius: 2px;
      transition: background 0.3s;
    }
    .step-line.filled { background: var(--brand); }

    /* === TYPE GRID === */
    .type-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 24px;
    }
    .type-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 18px 8px;
      border: 1.5px solid var(--n-200);
      border-radius: 14px;
      background: #fff;
      cursor: pointer;
      text-align: center;
      transition: all 0.15s;
    }
    .type-card:active { transform: scale(0.97); }
    .type-card:hover { border-color: var(--brand); background: var(--g-50); }
    .type-card.selected {
      border-color: var(--brand);
      background: var(--g-50);
      box-shadow: 0 0 0 4px rgba(39, 163, 55, 0.08);
    }
    .type-card .material-icons-outlined { font-size: 26px; color: var(--brand); }
    .type-card strong {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--heading-color);
    }
    .type-desc { font-size: 11px; color: var(--text-dim); }

    /* === FORM FIELDS === */
    .field { margin-bottom: 14px; }
    .field label {
      display: block;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 6px;
    }
    .field input {
      width: 100%;
      padding: 14px 16px;
      border: 1.5px solid var(--n-200);
      border-radius: 14px;
      font-size: 15px;
      background: var(--g-50);
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;
    }
    .field input:focus {
      outline: none;
      border-color: var(--brand);
      background: #fff;
      box-shadow: 0 0 0 4px rgba(39, 163, 55, 0.08);
    }
    .field input::placeholder { color: var(--n-400); }

    .field-row {
      display: flex;
      gap: 10px;
    }
    .field-row .field { flex: 1; }

    .input-wrap {
      display: flex;
      align-items: center;
      gap: 0;
      padding: 0 16px;
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
    .input-wrap .material-icons-outlined { font-size: 20px; width: 24px; text-align: center; margin-right: 10px; color: var(--text-dim); flex-shrink: 0; }
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

    .vendor-section {
      margin-top: 8px;
      padding-top: 14px;
      border-top: 1px solid var(--n-200);
    }
    .vendor-label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--brand);
      margin-bottom: 12px;
    }
    .vendor-label .material-icons-outlined { font-size: 18px; }

    .error-msg {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 12px;
      font-size: 13px;
      color: #dc2626;
      margin-bottom: 14px;
    }
    .error-msg .material-icons-outlined { font-size: 18px; flex-shrink: 0; }

    /* === BUTTONS === */
    .btn-row {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .btn-secondary {
      flex: 1;
      padding: 14px;
      border: 1.5px solid var(--n-200);
      background: #fff;
      border-radius: 14px;
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 600;
      color: var(--text-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.15s;
      box-sizing: border-box;
    }
    .btn-secondary:active { background: var(--n-100); }
    .btn-secondary:hover { background: var(--n-100); }
    .btn-secondary .material-icons-outlined { font-size: 18px; }

    .btn-primary {
      flex: 1.5;
      padding: 14px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: 14px;
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 52px;
      box-shadow: 0 4px 20px rgba(39, 163, 55, 0.3);
      transition: transform 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .btn-primary:active { transform: scale(0.98); }
    .btn-primary:hover { background: var(--brand-dark); box-shadow: 0 6px 24px rgba(39, 163, 55, 0.35); }
    .btn-primary:disabled { opacity: 0.45; box-shadow: none; cursor: default; transform: none; }
    .btn-primary .material-icons-outlined { font-size: 18px; }

    .spinner {
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .footer {
      margin-top: auto;
      padding-top: 20px;
      text-align: center;
    }
    .switch-link { font-size: 14px; color: var(--text-secondary); }
    .switch-link a { color: var(--brand); font-weight: 700; text-decoration: none; transition: opacity 0.2s; }
    .switch-link a:hover { opacity: 0.75; }

    /* === ILLUSTRATION (desktop) === */
    .illust-section { display: none; }

    @media (min-width: 900px) {
      .back-btn { display: none; }

      .form-section {
        order: 2;
        padding: 64px 48px;
        padding-top: 64px;
      }

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
      .steps-list {
        margin-top: 40px;
        padding-top: 28px;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }
      .s-item {
        display: flex;
        align-items: center;
        gap: 12px;
        color: rgba(255,255,255,0.7);
        font-size: 14px;
      }
      .s-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(108,217,126,0.15);
        border-radius: 10px;
        color: #6cd97e;
      }
      .s-icon .material-icons-outlined { font-size: 18px; }
      .s-arrow { color: rgba(255,255,255,0.2); margin-left: 18px; }
      .s-arrow .material-icons-outlined { font-size: 16px; }
    }
  `]
})
export class RegisterComponent {
  step = 1;
  nom = '';
  prenom = '';
  email = '';
  telephone = '';
  localite = '';
  motDePasse = '';
  showPassword = false;
  type = '';
  cnib = '';
  cooperative = '';
  photoProfil = '';
  photoCertificationBio = '';
  enCours = false;
  erreur = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submit() {
    if (this.enCours || !this.type) return;
    this.enCours = true;
    this.erreur = '';

    const data: any = {
      nom: this.nom, prenom: this.prenom, email: this.email,
      telephone: this.telephone, motDePasse: this.motDePasse,
      localite: this.localite, type: this.type
    };
    if (this.photoProfil) data.photoProfil = this.photoProfil;
    if (this.type === 'PRODUCTEUR') {
      if (this.cnib) data.cnib = this.cnib;
      if (this.cooperative) data.cooperative = this.cooperative;
      if (this.photoCertificationBio) data.photoCertificationBio = this.photoCertificationBio;
    }

    this.authService.register(data).subscribe({
      next: (r) => {
        ToastComponent.show(`Bienvenue ${r.utilisateur.prenom} !`, 'success');
        setTimeout(() => this.router.navigate(['/produits']), 800);
      },
      error: (err) => {
        this.enCours = false;
        this.erreur = err.error?.error || 'Erreur lors de l\'inscription';
      }
    });
  }
}
