import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commande } from '../models/commande.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class CommandeService extends ApiService {

  create(data: any): Observable<Commande> {
    return this.http.post<Commande>(`${this.baseUrl}/commandes`, data);
  }

  getMesCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/commandes/acheteur`);
  }

  getVentes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(`${this.baseUrl}/commandes/producteur`);
  }

  updateStatut(id: string, statut: string): Observable<Commande> {
    return this.http.patch<Commande>(`${this.baseUrl}/commandes/${id}/statut?statut=${statut}`, {});
  }
}
