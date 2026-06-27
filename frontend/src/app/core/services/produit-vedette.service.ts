import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProduitVedette } from '../models/produit-vedette.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class ProduitVedetteService extends ApiService {
  getActifs(): Observable<ProduitVedette[]> {
    return this.http.get<ProduitVedette[]>(`${this.baseUrl}/produits-vedettes`);
  }
}
