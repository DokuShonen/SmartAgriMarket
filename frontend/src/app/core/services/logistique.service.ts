import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { DemandeLivraison, SuiviLivraison } from '../models/livraison.model';

@Injectable({ providedIn: 'root' })
export class LogistiqueService extends ApiService {

  getDemande(commandeId: string): Observable<DemandeLivraison> {
    return this.http.get<DemandeLivraison>(`${this.baseUrl}/logistique/demandes/${commandeId}`);
  }

  getSuivi(demandeId: string): Observable<SuiviLivraison[]> {
    return this.http.get<SuiviLivraison[]>(`${this.baseUrl}/logistique/demandes/${demandeId}/suivi`);
  }
}
