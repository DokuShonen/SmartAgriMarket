import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DemandeLivraison, SuiviLivraison } from '../models/livraison.model';

@Injectable({ providedIn: 'root' })
export class LogistiqueService extends ApiService {

  getMesDemandes(): Observable<DemandeLivraison[]> {
    return this.http.get<DemandeLivraison[]>(`${this.baseUrl}/logistique/mes-demandes`);
  }

  getDemandesEnAttente(): Observable<DemandeLivraison[]> {
    return this.http.get<DemandeLivraison[]>(`${this.baseUrl}/logistique/en-attente`);
  }

  getMesLivraisons(): Observable<DemandeLivraison[]> {
    return this.http.get<DemandeLivraison[]>(`${this.baseUrl}/logistique/mes-livraisons`);
  }

  prendreEnCharge(demandeId: string): Observable<DemandeLivraison> {
    return this.http.post<DemandeLivraison>(`${this.baseUrl}/logistique/demandes/${demandeId}/prise-en-charge`, {});
  }

  confirmerLivraison(demandeId: string): Observable<DemandeLivraison> {
    return this.http.post<DemandeLivraison>(`${this.baseUrl}/logistique/demandes/${demandeId}/confirmer-livraison`, {});
  }

  getDemande(commandeId: string): Observable<DemandeLivraison> {
    return this.http.get<DemandeLivraison>(`${this.baseUrl}/logistique/demandes/${commandeId}`);
  }

  creerDemande(commandeId: string): Observable<DemandeLivraison> {
    return this.http.post<DemandeLivraison>(`${this.baseUrl}/logistique/demandes/${commandeId}`, {});
  }

  getSuivi(demandeId: string): Observable<SuiviLivraison[]> {
    return this.http.get<SuiviLivraison[]>(`${this.baseUrl}/logistique/demandes/${demandeId}/suivi`);
  }

  calculerFrais(distanceKm: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/logistique/calculer-frais?distanceKm=${distanceKm}`);
  }
}
