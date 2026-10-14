import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [NgIf, FormsModule],
  template: `
    <div class="search-bar" [class.focused]="isFocused">
      <span class="material-icons-outlined" aria-hidden="true">search</span>
      <input
        #searchInput
        type="text"
        [placeholder]="placeholder"
        [(ngModel)]="query"
        (ngModelChange)="queryChange.emit($event)"
        (input)="onInput()"
        (focus)="isFocused = true"
        (blur)="isFocused = false"
        [attr.aria-label]="ariaLabel"
      />
      <button
        *ngIf="query"
        class="search-clear"
        (click)="clear()"
        aria-label="Effacer la recherche"
        type="button"
      >
        <span class="material-icons-outlined" aria-hidden="true">close</span>
      </button>
    </div>
  `,
  styles: [`
    .search-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      border: 1px solid var(--n-200, #e8e6e1);
      border-radius: 12px;
      padding: 0 12px;
      height: 44px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-bar.focused {
      border-color: var(--g-500, #27a337);
      box-shadow: 0 0 0 3px rgba(39, 163, 55, 0.1);
    }

    .search-bar .material-icons-outlined {
      font-size: 20px;
      color: var(--text-dim, #a9a49b);
      flex-shrink: 0;
    }

    .search-bar input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 14px;
      font-family: inherit;
      color: var(--heading-color, #243238);
      outline: none;
      min-width: 0;
    }
    .search-bar input::placeholder {
      color: var(--text-dim, #a9a49b);
    }

    .search-clear {
      width: 28px;
      height: 28px;
      border: none;
      background: var(--n-100, #f4f3f0);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .search-clear:hover { background: var(--n-200, #e8e6e1); }
    .search-clear .material-icons-outlined {
      font-size: 16px;
      color: var(--text-secondary, #668c9c);
    }

    @media (max-width: 480px) {
      .search-bar { height: 42px; padding: 0 10px; }
    }
  `]
})
export class SearchBarComponent {
  @Input() query: string = '';
  @Input() placeholder: string = 'Rechercher...';
  @Input() ariaLabel: string = 'Rechercher';
  @Output() queryChange = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
  @ViewChild('searchInput') searchInput!: ElementRef;

  isFocused = false;

  onInput() {
    this.queryChange.emit(this.query);
  }

  clear() {
    this.query = '';
    this.queryChange.emit('');
    this.cleared.emit();
    this.searchInput?.nativeElement?.focus();
  }
}
