import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AnnonceMateriel } from '../models/annonce-materiel.model';

@Injectable({ providedIn: 'root' })
export class AnnonceMaterielService extends ApiService {
  getAll(): Observable<AnnonceMateriel[]> {
    return this.http.get<AnnonceMateriel[]>(`${this.baseUrl}/materiel`);
  }

  getById(id: string): Observable<AnnonceMateriel> {
    return this.http.get<AnnonceMateriel>(`${this.baseUrl}/materiel/${id}`);
  }

  getByType(type: string): Observable<AnnonceMateriel[]> {
    return this.http.get<AnnonceMateriel[]>(`${this.baseUrl}/materiel/type/${type}`);
  }

  create(data: any): Observable<AnnonceMateriel> {
    return this.http.post<AnnonceMateriel>(`${this.baseUrl}/materiel`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/materiel/${id}`);
  }
}
