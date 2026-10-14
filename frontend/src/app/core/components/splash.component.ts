import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  standalone: true,
  template: `
    <div class="splash" [class.fade-out]="dismissed">
      <div class="splash-content">
        <div class="splash-logo" [class.visible]="logoVisible">
          <img src="assets/logo.png" alt="SmartAgriMarket" />
        </div>
        <div class="splash-text" [class.visible]="textVisible">
          <span class="splash-brand">SmartAgri<span>Market</span></span>
        </div>
        <div class="splash-loader" [class.visible]="loaderVisible">
          <div class="loader-bar">
            <div class="loader-fill"></div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .splash {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background:
        radial-gradient(ellipse at 50% 30%, rgba(39,163,55,0.28) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 90%, rgba(255,138,41,0.12) 0%, transparent 50%),
        linear-gradient(160deg, #071d0c 0%, #0f3416 45%, #123f1c 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.6s var(--ease-out-expo), transform 0.6s var(--ease-out-expo);
    }
    .splash.fade-out {
      opacity: 0;
      transform: scale(1.06);
      pointer-events: none;
    }

    .splash-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 22px;
    }

    .splash-logo {
      width: 104px;
      height: 104px;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .splash-logo.visible {
      opacity: 1;
      transform: scale(1);
    }
    .splash-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 8px 32px rgba(39, 163, 55, 0.45));
    }

    .splash-text {
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;
    }
    .splash-text.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .splash-brand {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.02em;
    }
    .splash-brand span {
      color: #82d9a0;
    }

    .splash-loader {
      width: 120px;
      opacity: 0;
      transition: opacity 0.4s ease 0.5s;
    }
    .splash-loader.visible {
      opacity: 1;
    }

    .loader-bar {
      width: 100%;
      height: 3px;
      background: rgba(255, 255, 255, 0.15);
      border-radius: 2px;
      overflow: hidden;
    }

    .loader-fill {
      width: 0%;
      height: 100%;
      background: linear-gradient(90deg, #27a337, #82d9a0);
      border-radius: 2px;
      animation: load 1.5s ease-in-out forwards;
    }

    @keyframes load {
      0% { width: 0%; }
      50% { width: 70%; }
      100% { width: 100%; }
    }

    @media (prefers-reduced-motion: reduce) {
      .splash-logo, .splash-text, .splash-loader {
        transition: none;
        opacity: 1;
        transform: none;
      }
      .loader-fill { animation: none; width: 100%; }
    }
  `]
})
export class SplashComponent implements OnInit {
  logoVisible = false;
  textVisible = false;
  loaderVisible = false;
  dismissed = false;

  ngOnInit() {
    setTimeout(() => this.logoVisible = true, 100);
    setTimeout(() => this.textVisible = true, 400);
    setTimeout(() => this.loaderVisible = true, 600);
    setTimeout(() => this.dismissed = true, 2200);
  }
}
