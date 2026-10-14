import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class MessagerieService extends ApiService {

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/messagerie/conversations`);
  }

  getConversation(id: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.baseUrl}/messagerie/conversations/${id}`);
  }

  createConversation(destinataireId: string, produitId?: string): Observable<Conversation> {
    let params = `destinataireId=${destinataireId}`;
    if (produitId) params += `&produitId=${produitId}`;
    return this.http.post<Conversation>(`${this.baseUrl}/messagerie/conversations?${params}`, {});
  }

  sendMessage(contenu: string, conversationId?: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/messagerie/messages`, {
      conversationId,
      contenu
    });
  }
}
