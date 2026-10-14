import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit.model';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';

export interface ProduitSearchParams {
  keyword?: string;
  categorieId?: string;
  localite?: string;
  prixMin?: number;
  prixMax?: number;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ProduitService extends ApiService {

  search(params: ProduitSearchParams): Observable<PageResponse<Produit>> {
    let httpParams = new HttpParams();
    if (params.keyword) httpParams = httpParams.set('keyword', params.keyword);
    if (params.categorieId) httpParams = httpParams.set('categorieId', params.categorieId);
    if (params.localite) httpParams = httpParams.set('localite', params.localite);
    if (params.prixMin != null) httpParams = httpParams.set('prixMin', params.prixMin);
    if (params.prixMax != null) httpParams = httpParams.set('prixMax', params.prixMax);
    if (params.page != null) httpParams = httpParams.set('page', params.page);
    if (params.size != null) httpParams = httpParams.set('size', params.size);
    return this.http.get<PageResponse<Produit>>(`${this.baseUrl}/produits`, { params: httpParams });
  }

  getById(id: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.baseUrl}/produits/${id}`);
  }

  getByVendeur(vendeurId: string): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/produits/vendeur/${vendeurId}`);
  }

  getMesProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.baseUrl}/produits/vendeur/me`);
  }

  create(data: Partial<Produit>): Observable<Produit> {
    return this.http.post<Produit>(`${this.baseUrl}/produits`, data);
  }

  update(id: string, data: Partial<Produit>): Observable<Produit> {
    return this.http.put<Produit>(`${this.baseUrl}/produits/${id}`, data);
  }

  toggleActif(id: string): Observable<Produit> {
    return this.http.patch<Produit>(`${this.baseUrl}/produits/${id}/toggle-actif`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/produits/${id}`);
  }
}
