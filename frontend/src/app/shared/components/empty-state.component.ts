import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [NgIf, RouterLink],
  template: `
    <div class="empty-state">
      <span class="material-icons-outlined empty-icon">{{ icon }}</span>
      <h3>{{ title }}</h3>
      <p *ngIf="description">{{ description }}</p>
      <button *ngIf="actionLabel" class="empty-action" (click)="actionClick.emit()">
        <span class="material-icons-outlined" *ngIf="actionIcon">{{ actionIcon }}</span>
        {{ actionLabel }}
      </button>
      <a *ngIf="actionLink" class="empty-action" [routerLink]="actionLink">
        <span class="material-icons-outlined" *ngIf="actionIcon">{{ actionIcon }}</span>
        {{ actionLabel }}
      </a>
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 48px 24px;
      background: #fff;
      border: 1px solid var(--n-100, #f4f3f0);
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 3rem;
      color: var(--n-300, #d5d2cb);
      margin-bottom: 12px;
    }

    h3 {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--heading-color, #243238);
      margin-bottom: 4px;
    }

    p {
      font-size: 13px;
      color: var(--text-secondary, #668c9c);
      margin-bottom: 16px;
      max-width: 280px;
    }

    .empty-action {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 20px;
      background: var(--brand, #27a337);
      color: #fff;
      border: none;
      border-radius: 20px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      min-height: 40px;
    }
    .empty-action:hover { background: var(--brand-dark, #1e8a2d); }
    .empty-action .material-icons-outlined { font-size: 18px; }
  `]
})
export class EmptyStateComponent {
  @Input() icon: string = 'inbox';
  @Input() title: string = 'Aucun contenu';
  @Input() description: string = '';
  @Input() actionLabel: string = '';
  @Input() actionIcon: string = '';
  @Input() actionLink: string = '';
  @Output() actionClick = new EventEmitter<void>();
}
