import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Parametre } from '../models/parametre.model';

@Injectable({ providedIn: 'root' })
export class ParametreService extends ApiService {

  getAll(): Observable<Parametre[]> {
    return this.http.get<Parametre[]>(`${this.baseUrl}/admin/parametres`);
  }

  getByCle(cle: string): Observable<Parametre> {
    return this.http.get<Parametre>(`${this.baseUrl}/admin/parametres/${cle}`);
  }

  save(data: { cle: string; valeur: string; type?: string; description?: string }): Observable<Parametre> {
    return this.http.put<Parametre>(`${this.baseUrl}/admin/parametres`, data);
  }
}
