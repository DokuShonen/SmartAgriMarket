import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ProduitVedette } from '../models/produit-vedette.model';

@Injectable({ providedIn: 'root' })
export class ProduitVedetteService extends ApiService {
  getActifs(): Observable<ProduitVedette[]> {
    return this.http.get<ProduitVedette[]>(`${this.baseUrl}/produits-vedettes`);
  }

  ajouter(produitId: string): Observable<ProduitVedette> {
    return this.http.post<ProduitVedette>(`${this.baseUrl}/produits-vedettes`, { produitId });
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/produits-vedettes/${id}`);
  }
}
