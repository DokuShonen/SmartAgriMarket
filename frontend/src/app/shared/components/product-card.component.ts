import { Component, Input } from '@angular/core';
import { NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [NgIf, DecimalPipe, RouterLink],
  template: `
    <a class="product-card stagger-item" [routerLink]="link">
      <div class="card-img-wrap">
        <img [src]="image" [alt]="title" class="card-img-real" loading="lazy" />
        <span class="stock-tag" *ngIf="stock !== null" [class.low]="stock < 5">
          {{ stock }} dispo
        </span>
        <span class="badge-overlay" *ngIf="badge">{{ badge }}</span>
      </div>
      <div class="card-body">
        <h3>{{ title }}</h3>
        <p class="card-price">
          {{ price | number }} FCFA
          <span class="card-unit" *ngIf="unit">/ {{ unit }}</span>
        </p>
        <div class="card-info" *ngIf="location || verified">
          <span class="info-item" *ngIf="location">
            <span class="material-icons-outlined" aria-hidden="true">location_on</span>
            {{ location }}
          </span>
          <span class="info-item" *ngIf="verified">
            <span class="material-icons-outlined verified" aria-hidden="true">verified</span>
          </span>
        </div>
        <span class="cat-tag" *ngIf="category">{{ category }}</span>
      </div>
    </a>
  `,
  styles: [`
    .product-card {
      display: block;
      background: rgba(255,255,255,0.78);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.5);
      border-radius: var(--radius-lg, 20px);
      overflow: hidden;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 8px rgba(26,26,46,0.04), inset 0 1px 1px rgba(255,255,255,0.2);
      transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s cubic-bezier(0.22,1,0.36,1);
    }
    .product-card:hover {
      box-shadow: 0 16px 40px rgba(26,26,46,0.10);
      transform: translateY(-6px);
    }
    .product-card:active { transform: scale(0.98); }

    .card-img-wrap {
      position: relative;
      aspect-ratio: 1;
      background: var(--g-50, #f0faf4);
      overflow: hidden;
    }
    .card-img-real {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.7s cubic-bezier(0.22,1,0.36,1);
    }
    .product-card:hover .card-img-real { transform: scale(1.06); }

    .stock-tag {
      position: absolute;
      bottom: 8px;
      left: 8px;
      padding: 3px 10px;
      background: rgba(255, 255, 255, 0.94);
      border-radius: var(--radius-pill, 9999px);
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 700;
      color: var(--brand, #27a337);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
    }
    .stock-tag.low { color: #dc2626; }

    .badge-overlay {
      position: absolute;
      top: 8px;
      right: 8px;
      padding: 3px 10px;
      background: var(--brand, #27a337);
      color: #fff;
      border-radius: var(--radius-pill, 9999px);
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .card-body { padding: 12px 14px 16px; }

    .card-body h3 {
      font-family: var(--font-display);
      font-size: 13.5px;
      font-weight: 700;
      color: var(--heading-color, #1a1a2e);
      line-height: 1.3;
      margin-bottom: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-price {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 800;
      color: var(--brand, #27a337);
      margin-bottom: 5px;
    }
    .card-unit {
      font-size: 11px;
      font-weight: 500;
      color: var(--text-dim, #a1a1aa);
    }

    .card-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 6px;
    }
    .info-item {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      font-size: 11px;
      color: var(--text-dim, #a1a1aa);
    }
    .info-item .material-icons-outlined { font-size: 14px; }
    .info-item .verified { color: var(--brand, #27a337); }

    .cat-tag {
      display: inline-block;
      padding: 3px 10px;
      background: var(--g-50, #f0faf4);
      color: var(--brand, #27a337);
      border-radius: var(--radius-pill, 9999px);
      font-size: 10px;
      font-weight: 600;
    }
  `]
})
export class ProductCardComponent {
  @Input() link: string = '';
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() unit: string = '';
  @Input() stock: number | null = null;
  @Input() location: string = '';
  @Input() verified: boolean = false;
  @Input() category: string = '';
  @Input() badge: string = '';
}
