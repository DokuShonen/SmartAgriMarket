import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class UtilisateurService extends ApiService {

  getMe(): Observable<Utilisateur> {
    return this.http.get<Utilisateur>(`${this.baseUrl}/utilisateurs/me`);
  }

  updateMe(data: { nom?: string; prenom?: string; telephone?: string; localite?: string; photoProfil?: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.baseUrl}/utilisateurs/me`, data);
  }

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(`${this.baseUrl}/utilisateurs`);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/utilisateurs/${id}`);
  }

  toggleVerification(id: string): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(`${this.baseUrl}/utilisateurs/${id}/verifier`, {});
  }

  toggleSuspension(id: string): Observable<Utilisateur> {
    return this.http.patch<Utilisateur>(`${this.baseUrl}/utilisateurs/${id}/suspendre`, {});
  }

  updatePseudo(data: { pseudo: string }): Observable<Utilisateur> {
    return this.http.put<Utilisateur>(`${this.baseUrl}/utilisateurs/me/pseudo`, data);
  }
}
