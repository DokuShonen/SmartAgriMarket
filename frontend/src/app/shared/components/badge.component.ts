import { Component, Input } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

export type BadgeVariant = 'attente' | 'confirmee' | 'preparation' | 'livraison' | 'livree' | 'annulee' | 'encours' | 'ok' | 'warn' | 'red' | 'blue' | 'green' | 'yellow' | 'accent';

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  'EN_ATTENTE':        { variant: 'attente',     label: 'En attente' },
  'CONFIRMEE':         { variant: 'confirmee',   label: 'Confirmée' },
  'EN_PREPARATION':    { variant: 'preparation',  label: 'Préparation' },
  'EN_COURS_LIVRAISON':{ variant: 'livraison',   label: 'Livraison' },
  'LIVREE':            { variant: 'livree',      label: 'Livrée' },
  'ANNULEE':           { variant: 'annulee',     label: 'Annulée' },
  'PRISE_EN_CHARGE':   { variant: 'encours',     label: 'Prise en charge' },
  'EN_COURS':          { variant: 'encours',     label: 'En cours' },
  'RESOLU':            { variant: 'ok',          label: 'Résolu' },
  'REJETE':            { variant: 'red',         label: 'Rejeté' },
  'VALIDE':            { variant: 'green',       label: 'Validé' },
  'REFUSE':            { variant: 'red',         label: 'Refusé' },
  'PAYE':              { variant: 'ok',          label: 'Payé' },
  'ACTIVE':            { variant: 'ok',          label: 'Active' },
  'FERME':             { variant: 'warn',        label: 'Fermé' },
};

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [NgIf, NgClass],
  template: `
    <span class="badge" [ngClass]="computedClass" [attr.aria-label]="ariaLabel || computedLabel">
      <span class="material-icons-outlined" *ngIf="icon" aria-hidden="true">{{ icon }}</span>
      {{ computedLabel }}
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 10px;
      border-radius: 8px;
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      line-height: 1.6;
    }
    .badge .material-icons-outlined { font-size: 14px; }

    /* Order status */
    .badge-attente     { background: #fef3c7; color: #b45309; }
    .badge-confirmee   { background: #dbeafe; color: #1d4ed8; }
    .badge-preparation { background: #f3e8ff; color: #7c3aed; }
    .badge-livraison   { background: #dbeafe; color: #1d4ed8; }
    .badge-livree      { background: #d1fae5; color: #059669; }
    .badge-annulee     { background: #fee2e2; color: #dc2626; }
    .badge-encours     { background: #dbeafe; color: #1d4ed8; }

    /* Semantic */
    .badge-ok      { background: #e8f5e9; color: #2e7d32; }
    .badge-warn    { background: #fff3e0; color: #e65100; }
    .badge-red     { background: #ffebee; color: #c62828; }
    .badge-blue    { background: #e3f2fd; color: #1565c0; }
    .badge-green   { background: #e8f5e9; color: #2e7d32; }
    .badge-yellow  { background: #fef3c7; color: #b45309; }
    .badge-accent  { background: var(--g-50, #f0faf4); color: var(--brand, #27a337); }
  `]
})
export class BadgeComponent {
  @Input() status: string = '';
  @Input() variant: BadgeVariant = 'blue';
  @Input() label: string = '';
  @Input() icon: string = '';
  @Input() ariaLabel: string = '';

  get computedClass(): string {
    if (this.status) {
      const mapped = STATUS_MAP[this.status];
      return mapped ? `badge-${mapped.variant}` : 'badge-blue';
    }
    return `badge-${this.variant}`;
  }

  get computedLabel(): string {
    if (this.label) return this.label;
    if (this.status) {
      const mapped = STATUS_MAP[this.status];
      return mapped ? mapped.label : this.status;
    }
    return '';
  }
}
