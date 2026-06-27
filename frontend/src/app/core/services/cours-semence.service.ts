import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoursSemence } from '../models/cours-semence.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CoursSemenceService extends ApiService {
  getAll(): Observable<CoursSemence[]> {
    return this.http.get<CoursSemence[]>(`${this.baseUrl}/cours-semences`);
  }

  getByLocalite(localite: string): Observable<CoursSemence[]> {
    return this.http.get<CoursSemence[]>(`${this.baseUrl}/cours-semences/localite/${localite}`);
  }
}
