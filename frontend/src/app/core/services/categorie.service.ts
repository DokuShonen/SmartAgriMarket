import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categorie } from '../models/categorie.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CategorieService extends ApiService {
  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.baseUrl}/categories`);
  }
}
