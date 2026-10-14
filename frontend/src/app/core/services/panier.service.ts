import { Injectable, effect, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produit } from '../models/produit.model';

export interface PanierItem {
  produit: Produit;
  quantite: number;
}

@Injectable({ providedIn: 'root' })
export class PanierService {
  private items = new BehaviorSubject<PanierItem[]>([]);
  private userId: string | null = null;

  constructor() {
    const saved = localStorage.getItem('smartagri_user');
    if (saved) {
      try {
        const user = JSON.parse(saved);
        this.userId = user.id || null;
      } catch { this.userId = null; }
    }
    this.items.next(this.load());
  }

  setUserId(userId: string | null) {
    this.userId = userId;
    this.items.next(this.load());
  }

  getItems(): Observable<PanierItem[]> {
    return this.items.asObservable();
  }

  getSnapshot(): PanierItem[] {
    const v = this.items.getValue();
    console.log('[PanierService] getSnapshot:', v?.length, 'items, key:', this.getStorageKey());
    return v;
  }

  add(produit: Produit, quantite = 1) {
    const current = this.getSnapshot();
    const existant = current.find(i => i.produit.id === produit.id);
    if (existant) {
      existant.quantite += quantite;
    } else {
      current.push({ produit, quantite });
    }
    this.save(current);
  }

  updateQuantite(produitId: string, quantite: number) {
    const current = this.getSnapshot();
    const item = current.find(i => i.produit.id === produitId);
    if (item) {
      item.quantite = quantite;
      if (item.quantite <= 0) {
        return this.remove(produitId);
      }
    }
    this.save(current);
  }

  remove(produitId: string) {
    const current = this.getSnapshot().filter(i => i.produit.id !== produitId);
    this.save(current);
  }

  clear() {
    this.save([]);
  }

  get total(): number {
    return this.getSnapshot().reduce((sum, i) => sum + i.produit.prix * i.quantite, 0);
  }

  get count(): number {
    return this.getSnapshot().reduce((sum, i) => sum + i.quantite, 0);
  }

  private getStorageKey(): string {
    return this.userId ? `smartagri_panier_${this.userId}` : 'smartagri_panier_anonymous';
  }

  private load(): PanierItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.getStorageKey()) || '[]');
    } catch { return []; }
  }

  private save(items: PanierItem[]) {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(items));
    this.items.next(items);
  }
}
