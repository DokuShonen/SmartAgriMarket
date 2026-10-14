import { Component, HostListener, signal } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pwa-install',
  standalone: true,
  imports: [NgIf],
  template: `
    <div *ngIf="showPrompt()" class="pwa-install-banner">
      <div class="pwa-install-content">
        <span class="material-icons-outlined pwa-icon">install_mobile</span>
        <div class="pwa-text">
          <strong>Installez SmartAgriMarket</strong>
          <span>Accédez plus rapidement à vos fonctionnalités</span>
        </div>
        <button class="pwa-btn" (click)="installer()">Installer</button>
        <button class="pwa-close" (click)="fermer()">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pwa-install-banner {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1b5e20;
      color: #fff;
      padding: 12px 16px;
      z-index: 9999;
      box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
    }
    .pwa-install-content {
      display: flex;
      align-items: center;
      gap: 12px;
      max-width: 600px;
      margin: 0 auto;
    }
    .pwa-icon { font-size: 32px; }
    .pwa-text {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      font-size: 14px;
    }
    .pwa-btn {
      background: #fff;
      color: #1b5e20;
      border: none;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    .pwa-close {
      background: transparent;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px;
    }
  `]
})
export class PwaInstallComponent {
  private deferredPrompt: any = null;
  showPrompt = signal(false);

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(event: Event) {
    event.preventDefault();
    this.deferredPrompt = event;
    this.showPrompt.set(true);
  }

  installer() {
    if (!this.deferredPrompt) return;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then(() => {
      this.deferredPrompt = null;
      this.showPrompt.set(false);
    });
  }

  fermer() {
    this.showPrompt.set(false);
  }
}
