import { Component, Input } from '@angular/core';
import { NgIf, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [NgIf, DecimalPipe],
  template: `
    <div class="stat-card" [class.accent]="accent" [class.compact]="compact">
      <div class="stat-icon-wrap" *ngIf="icon">
        <span class="material-icons-outlined">{{ icon }}</span>
      </div>
      <div class="stat-info">
        <span class="stat-value">{{ value }}</span>
        <span class="stat-label">{{ label }}</span>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      border: 1px solid var(--n-100, #f4f3f0);
      border-radius: 12px;
      padding: 14px 16px;
      flex: 1;
      min-width: 0;
      transition: box-shadow 0.2s;
    }
    .stat-card:hover { box-shadow: var(--shadow-sm); }

    .stat-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: var(--brand-light, #e8f5e9);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-wrap .material-icons-outlined {
      font-size: 22px;
      color: var(--brand, #27a337);
    }

    .stat-info { flex: 1; min-width: 0; }

    .stat-value {
      display: block;
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--heading-color, #243238);
      line-height: 1.2;
    }

    .stat-label {
      display: block;
      font-size: 11px;
      color: var(--text-dim, #a9a49b);
      margin-top: 2px;
    }

    /* Accent variant (highlighted card) */
    .stat-card.accent {
      background: var(--g-50, #f0faf4);
      border-color: var(--g-100, #dcf5e3);
    }
    .stat-card.accent .stat-value {
      color: var(--brand, #27a337);
    }

    /* Compact variant (no icon, centered) */
    .stat-card.compact {
      justify-content: center;
      text-align: center;
      padding: 12px 8px;
    }
    .stat-card.compact .stat-value {
      font-size: 1.2rem;
    }

    @media (max-width: 768px) {
      .stat-card { padding: 12px; gap: 10px; }
      .stat-icon-wrap { width: 38px; height: 38px; }
      .stat-icon-wrap .material-icons-outlined { font-size: 20px; }
      .stat-value { font-size: 1.1rem; }
    }
  `]
})
export class StatCardComponent {
  @Input() icon: string = '';
  @Input() value: string | number = '';
  @Input() label: string = '';
  @Input() accent: boolean = false;
  @Input() compact: boolean = false;
}
