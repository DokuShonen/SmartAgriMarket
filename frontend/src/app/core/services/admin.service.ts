import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Message, Conversation } from '../models/conversation.model';
import { Commentaire } from './commentaire.service';

export interface MoisStats {
  annee: number;
  mois: number;
  nombreCommandes: number;
  montantTotal: number;
}

export interface Signalement {
  id: string;
  typeCible: string;
  cibleId: string;
  cibleNom: string;
  motif: string;
  statut: string;
  auteurPrenom: string;
  auteurNom: string;
  dateCreation: string;
}

export interface DashboardStats {
  totalUtilisateurs: number;
  totalProducteurs: number;
  totalAcheteurs: number;
  totalCommandes: number;
  commandesAbouties: number;
  revenuTotal: number;
  totalProduits: number;
  commandesParMois: MoisStats[];
}

@Injectable({ providedIn: 'root' })
export class AdminService extends ApiService {

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/admin/stats`);
  }

  getTousLesMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.baseUrl}/admin/messages`);
  }

  supprimerMessage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/messages/${id}`);
  }

  getToutesLesConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/admin/conversations`);
  }

  supprimerConversation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/conversations/${id}`);
  }

  getTousLesCommentaires(): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.baseUrl}/admin/commentaires`);
  }

  supprimerCommentaire(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/admin/commentaires/${id}`);
  }

  getSignalements(): Observable<Signalement[]> {
    return this.http.get<Signalement[]>(`${this.baseUrl}/signalements`);
  }

  updateSignalementStatut(id: string, statut: string): Observable<Signalement> {
    return this.http.patch<Signalement>(`${this.baseUrl}/signalements/${id}/statut?statut=${statut}`, {});
  }
}
