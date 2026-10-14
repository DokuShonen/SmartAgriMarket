import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Evaluation {
  id: string;
  note: number;
  commentaire: string;
  dateCreation: string;
  donneurId?: string;
  donneurNom?: string;
  receveurId?: string;
  receveurNom?: string;
}

@Injectable({ providedIn: 'root' })
export class EvaluationService extends ApiService {

  getByReceveur(receveurId: string): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.baseUrl}/evaluations/receveur/${receveurId}`);
  }

  create(data: { receveurId: string; note: number; commentaire: string }): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.baseUrl}/evaluations`, data);
  }
}
