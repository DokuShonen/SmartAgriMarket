import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgIf, NgFor],
  template: `
    <div class="toast-container">
      <div *ngFor="let t of toasts"
           class="toast"
           [class.success]="t.type === 'success'"
           [class.error]="t.type === 'error'"
           [class.info]="t.type === 'info'">
        <span class="material-icons-outlined toast-icon">
          {{ t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : 'info' }}
        </span>
        <span class="toast-message">{{ t.message }}</span>
        <button class="toast-close" (click)="dismiss(t.id)">
          <span class="material-icons-outlined">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 380px;
    }

    .toast {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.85rem 1rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      border-left: 4px solid;
      animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toast.success { border-left-color: #22c55e; }
    .toast.error { border-left-color: #ef4444; }
    .toast.info { border-left-color: #3b82f6; }

    .toast-icon { font-size: 1.2rem; flex-shrink: 0; }
    .toast.success .toast-icon { color: #22c55e; }
    .toast.error .toast-icon { color: #ef4444; }
    .toast.info .toast-icon { color: #3b82f6; }

    .toast-message { flex: 1; font-size: 0.85rem; color: #333; font-weight: 500; }

    .toast-close {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
      padding: 0.2rem;
      display: flex;
      align-items: center;
      transition: color 0.2s;
    }
    .toast-close:hover { color: #666; }
    .toast-close .material-icons-outlined { font-size: 0.95rem; }

    @keyframes slideIn {
      from { opacity: 0; transform: translateX(30px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @media (max-width: 768px) {
      .toast-container { right: 0.75rem; left: 0.75rem; max-width: none; top: 70px; }
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private nextId = 0;
  private static instance: ToastComponent;

  static show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    if (ToastComponent.instance) {
      ToastComponent.instance.addToast(message, type);
    }
  }

  ngOnInit() {
    ToastComponent.instance = this;
  }

  ngOnDestroy() {
    ToastComponent.instance = undefined as any;
  }

  addToast(message: string, type: 'success' | 'error' | 'info') {
    const id = this.nextId++;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.dismiss(id), 4000);
  }

  dismiss(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
