import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="loading-overlay" *ngIf="!erreur">
      <div class="spinner">
        <div class="spinner-ring"></div>
      </div>
      <p class="loading-text">{{ message }}</p>
    </div>
    <div class="error-overlay" *ngIf="erreur">
      <span class="material-icons-outlined">cloud_off</span>
      <h3>{{ erreur }}</h3>
      <p>Vérifiez que le serveur est démarré</p>
      <button class="retry-btn" (click)="retry.emit()">
        <span class="material-icons-outlined">refresh</span>
        Réessayer
      </button>
    </div>
  `,
  styles: [`
    .loading-overlay, .error-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 240px;
      gap: 16px;
      padding: 24px;
    }
    .spinner {
      position: relative;
      width: 44px;
      height: 44px;
    }
    .spinner::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(39,163,55,0.12) 0%, transparent 70%);
      animation: pulse 1.6s ease-in-out infinite;
    }
    .spinner-ring {
      width: 100%;
      height: 100%;
      border: 3px solid var(--g-100);
      border-top-color: var(--brand);
      border-radius: 50%;
      animation: spin 0.7s cubic-bezier(0.5,0.1,0.5,0.9) infinite;
    }
    .loading-text {
      font-family: var(--font-ui);
      font-size: 13px;
      color: var(--text-dim);
      letter-spacing: 0.01em;
    }
    .error-overlay .material-icons-outlined { font-size: 2.75rem; color: var(--n-300); }
    .error-overlay h3 {
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--heading-color);
      text-align: center;
      max-width: 320px;
    }
    .error-overlay p { font-size: 13px; color: var(--text-secondary); }
    .retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: var(--radius-pill);
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      min-height: 46px;
      box-shadow: 0 8px 24px rgba(39,163,55,0.28);
      transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
    }
    .retry-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(39,163,55,0.35); }
    .retry-btn:active { transform: scale(0.97); }
    .retry-btn .material-icons-outlined { font-size: 18px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(0.9); }
      50% { opacity: 1; transform: scale(1.1); }
    }
  `]
})
export class LoadingComponent {
  @Input() message = 'Chargement...';
  @Input() erreur = '';
  @Output() retry = new EventEmitter<void>();
}
