import { Component, EventEmitter, Input, Output, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="modal-overlay" *ngIf="open" (click)="fermer()" role="dialog" aria-modal="true" [attr.aria-label]="titre">
      <div class="modal-container" (click)="$event.stopPropagation()" #container>
        <div class="modal-handle" *ngIf="isMobile"></div>
        <div class="modal-header">
          <h2 id="modal-title">{{ titre }}</h2>
          <button class="modal-close" (click)="fermer()" aria-label="Fermer">
            <span class="material-icons-outlined" aria-hidden="true">close</span>
          </button>
        </div>
        <div class="modal-body">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      animation: fadeIn 0.15s ease;
    }

    .modal-container {
      background: #fff;
      border-radius: 16px;
      width: 100%;
      max-width: 560px;
      max-height: 90vh;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      animation: slideUp 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    }

    .modal-handle {
      width: 36px;
      height: 4px;
      background: var(--n-300);
      border-radius: 2px;
      margin: 8px auto 0;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      border-bottom: 1px solid var(--n-100);
    }

    .modal-header h2 {
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      color: var(--heading-color);
    }

    .modal-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: none;
      background: var(--n-100);
      border-radius: 50%;
      color: var(--text-secondary);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .modal-close:hover { background: var(--n-200); }
    .modal-close:active { transform: scale(0.92); }

    .modal-body { padding: 20px; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .modal-overlay {
        align-items: flex-end;
        padding: 0;
      }
      .modal-container {
        max-width: 100%;
        max-height: 92vh;
        border-radius: 16px 16px 0 0;
        animation: slideUpSheet 0.3s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .modal-body { padding: 16px; padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px)); }
    }

    @keyframes slideUpSheet {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `]
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() open = false;
  @Input() titre = '';
  @Output() closed = new EventEmitter<void>();
  @ViewChild('container') container!: ElementRef;

  isMobile = false;
  private previousFocus: HTMLElement | null = null;
  private keyHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this.fermer();
  };

  constructor() {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit() {
    if (this.open) this.trapFocus();
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.keyHandler);
  }

  fermer() {
    this.closed.emit();
    document.removeEventListener('keydown', this.keyHandler);
    if (this.previousFocus) this.previousFocus.focus();
  }

  private trapFocus() {
    this.previousFocus = document.activeElement as HTMLElement;
    document.addEventListener('keydown', this.keyHandler);
    setTimeout(() => {
      const el = this.container?.nativeElement;
      if (el) {
        const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (focusable) focusable.focus();
      }
    }, 100);
  }
}
