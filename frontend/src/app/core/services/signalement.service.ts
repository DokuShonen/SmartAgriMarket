import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SignalementRequest {
  typeCible: 'PRODUIT' | 'MESSAGE' | 'UTILISATEUR';
  cibleId: string;
  motif: string;
}

export interface SignalementResponse {
  id: string;
  typeCible: string;
  cibleId: string;
  motif: string;
  statut: string;
  dateCreation: string;
}

@Injectable({ providedIn: 'root' })
export class SignalementService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  create(data: SignalementRequest): Observable<SignalementResponse> {
    return this.http.post<SignalementResponse>(`${this.apiUrl}/signalements`, data);
  }
}