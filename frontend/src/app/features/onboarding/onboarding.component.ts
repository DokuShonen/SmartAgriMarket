import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [NgIf, NgFor, RouterLink],
  template: `
    <div class="onboarding-overlay" *ngIf="visible">
      <div class="onboarding-modal">
        <button class="btn-close" (click)="dismiss()">
          <span class="material-icons-outlined">close</span>
        </button>
        <div class="onboarding-content">
          <div class="onboarding-icon">
            <span class="material-icons-outlined">{{ slides[slide].icon }}</span>
          </div>
          <h2>{{ slides[slide].titre }}</h2>
          <p>{{ slides[slide].description }}</p>
          <div class="dots">
            <span *ngFor="let s of slides; let i = index" class="dot" [class.active]="i === slide"></span>
          </div>
          <div class="onboarding-actions">
            <button class="btn-skip" (click)="dismiss()">Passer</button>
            <button class="btn-next-onboard" (click)="next()">
              {{ slide < slides.length - 1 ? 'Suivant' : 'Commencer' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .onboarding-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background: #fff;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .onboarding-modal {
      position: relative;
      width: 100%;
      max-width: 480px;
    }

    .btn-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border: none;
      background: var(--g-50);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-secondary);
      transition: background 0.15s;
    }
    .btn-close:hover { background: var(--g-100); }

    .onboarding-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
    }

    .onboarding-icon {
      margin-bottom: 2rem;
    }
    .onboarding-icon .material-icons-outlined {
      font-size: 5rem;
      color: var(--brand);
    }

    h2 {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--heading-color);
    }

    p {
      font-size: 0.95rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 2rem;
      max-width: 320px;
    }

    .dots {
      display: flex;
      justify-content: center;
      gap: 6px;
      margin-bottom: 2rem;
    }

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--n-200);
      transition: all 0.3s ease;
    }
    .dot.active {
      width: 24px;
      border-radius: 4px;
      background: var(--brand);
    }

    .onboarding-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
      width: 100%;
      max-width: 320px;
    }

    .btn-skip {
      padding: 14px;
      border: 1px solid var(--n-200);
      border-radius: var(--radius-pill);
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 600;
      color: var(--text-secondary);
      background: #fff;
      cursor: pointer;
      min-height: 48px;
    }

    .btn-next-onboard {
      padding: 14px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: var(--radius-pill);
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      min-height: 48px;
      transition: background 0.2s;
    }
    .btn-next-onboard:active { background: var(--brand-dark); transform: scale(0.98); }

    @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

    @media (min-width: 769px) {
      .onboarding-overlay {
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
      }
      .onboarding-modal {
        background: #fff;
        border-radius: 24px;
        padding: 3rem;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      }
      .onboarding-actions { max-width: 360px; }
      h2 { font-size: 1.8rem; }
      p { font-size: 1.05rem; max-width: 420px; }
      .onboarding-icon .material-icons-outlined { font-size: 6rem; }
    }
  `]
})
export class OnboardingComponent implements OnInit {
  slide = 0;
  visible = false;

  slides = [
    {
      icon: 'waving_hand',
      titre: 'Bienvenue sur SmartAgriMarket',
      description: 'La marketplace qui connecte directement producteurs et acheteurs au Burkina Faso.'
    },
    {
      icon: 'eco',
      titre: 'Parcourez les produits',
      description: 'Consultez les fruits, légumes, céréales et produits transformés près de chez vous.'
    },
    {
      icon: 'chat',
      titre: 'Échangez via la messagerie',
      description: 'Discutez avec les vendeurs, négociez les prix et organisez la livraison.'
    },
    {
      icon: 'inventory_2',
      titre: 'Suivez vos commandes',
      description: 'Recevez des notifications à chaque étape, du paiement à la livraison.'
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const dismissed = localStorage.getItem('smartagri_onboarding_done');
    if (!dismissed) {
      setTimeout(() => (this.visible = true), 500);
    }
  }

  next() {
    if (this.slide < this.slides.length - 1) {
      this.slide++;
    } else {
      this.dismiss();
    }
  }

  dismiss() {
    this.visible = false;
    localStorage.setItem('smartagri_onboarding_done', 'true');
  }
}
