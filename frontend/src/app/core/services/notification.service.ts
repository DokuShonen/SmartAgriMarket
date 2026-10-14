import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Notification {
  id: string;
  titre: string;
  contenu: string;
  estLue: boolean;
  type: string;
  lien?: string;
  dateCreation: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService extends ApiService {

  getMesNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/notifications`);
  }

  getNonLues(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/notifications/non-lues`);
  }

  marquerLue(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/notifications/${id}/lue`, {});
  }

  marquerToutLu(): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/notifications/tout-lu`, {});
  }
}
