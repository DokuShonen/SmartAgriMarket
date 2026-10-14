import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgClass, NgIf } from '@angular/common';

export interface FilterChip {
  value: string;
  label: string;
  icon?: string;
}

@Component({
  selector: 'app-filter-chips',
  standalone: true,
  imports: [NgFor, NgClass, NgIf],
  template: `
    <div class="filter-chips" [class.wrap]="wrap" role="tablist" [attr.aria-label]="ariaLabel">
      <button
        *ngFor="let chip of chips"
        role="tab"
        class="chip"
        [class.active]="selected === chip.value"
        [attr.aria-selected]="selected === chip.value"
        (click)="select(chip.value)"
      >
        <span *ngIf="chip.icon" class="material-icons-outlined" aria-hidden="true">{{ chip.icon }}</span>
        {{ chip.label }}
      </button>
    </div>
  `,
  styles: [`
    .filter-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      padding: 4px 0;
      margin-bottom: 12px;
    }
    .filter-chips::-webkit-scrollbar { display: none; }
    .filter-chips.wrap {
      flex-wrap: wrap;
      overflow-x: visible;
    }

    .chip {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 7px 14px;
      border: 1px solid var(--n-200, #e8e6e1);
      border-radius: 20px;
      background: #fff;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary, #668c9c);
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .chip.active {
      background: var(--brand, #27a337);
      color: #fff;
      border-color: var(--brand, #27a337);
    }
    .chip:active { transform: scale(0.96); }
    .chip .material-icons-outlined { font-size: 16px; }
  `]
})
export class FilterChipsComponent {
  @Input() chips: FilterChip[] = [];
  @Input() selected: string = '';
  @Input() wrap: boolean = false;
  @Input() ariaLabel: string = 'Filtrer';
  @Output() selectedChange = new EventEmitter<string>();

  select(value: string) {
    this.selected = value;
    this.selectedChange.emit(value);
  }
}
