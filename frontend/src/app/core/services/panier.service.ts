import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Produit } from '../models/produit.model';

export interface PanierItem {
  produit: Produit;
  quantite: number;
}

const STORAGE_KEY = 'smartagri_panier';

@Injectable({ providedIn: 'root' })
export class PanierService {
  private items = new BehaviorSubject<PanierItem[]>(this.load());

  getItems(): Observable<PanierItem[]> {
    return this.items.asObservable();
  }

  getSnapshot(): PanierItem[] {
    return this.items.getValue();
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

  private load(): PanierItem[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  }

  private save(items: PanierItem[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    this.items.next(items);
  }
}
