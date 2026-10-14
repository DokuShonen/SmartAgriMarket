import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { CoursSemence } from '../models/cours-semence.model';

@Injectable({ providedIn: 'root' })
export class CoursSemenceService extends ApiService {
  getAll(): Observable<CoursSemence[]> {
    return this.http.get<CoursSemence[]>(`${this.baseUrl}/cours-semences`);
  }

  getByLocalite(localite: string): Observable<CoursSemence[]> {
    return this.http.get<CoursSemence[]>(`${this.baseUrl}/cours-semences/localite/${localite}`);
  }

  create(data: { produit: string; prix: number; localite: string; source: string }): Observable<CoursSemence> {
    return this.http.post<CoursSemence>(`${this.baseUrl}/cours-semences`, data);
  }

  update(id: string, data: { produit: string; prix: number; localite: string; source: string }): Observable<CoursSemence> {
    return this.http.put<CoursSemence>(`${this.baseUrl}/cours-semences/${id}`, data);
  }

  supprimer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cours-semences/${id}`);
  }
}
