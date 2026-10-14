import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Badge {
  id: string;
  type: string;
  statut: string;
  documentUrl?: string;
  commentaire?: string;
  dateDemande: string;
  dateTraitement?: string;
  utilisateur?: { id: string; prenom: string; nom: string };
}

@Injectable({ providedIn: 'root' })
export class BadgeService extends ApiService {
  demander(data: { type: string; documentUrl?: string }): Observable<Badge> {
    return this.http.post<Badge>(`${this.baseUrl}/badges/demander`, data);
  }

  getMesBadges(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.baseUrl}/badges/mes-badges`);
  }

  getEnAttente(): Observable<Badge[]> {
    return this.http.get<Badge[]>(`${this.baseUrl}/badges/en-attente`);
  }

  traiter(id: string, statut: string, commentaire?: string): Observable<Badge> {
    let url = `${this.baseUrl}/badges/${id}/traiter?statut=${statut}`;
    if (commentaire) url += `&commentaire=${encodeURIComponent(commentaire)}`;
    return this.http.patch<Badge>(url, {});
  }

  verifier(userId: string, type: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/badges/verifier/${userId}/${type}`);
  }
}
