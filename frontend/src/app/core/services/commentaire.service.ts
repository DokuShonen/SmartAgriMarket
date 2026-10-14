import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Commentaire {
  id: string;
  contenu: string;
  likes: number;
  dateCreation: string;
  auteurId: string;
  auteurNom: string;
  auteurPhoto?: string;
  parentId?: string;
  articleId?: string;
  articleTitre?: string;
  reponses: Commentaire[];
  liked: boolean;
}

@Injectable({ providedIn: 'root' })
export class CommentaireService extends ApiService {

  getParArticle(articleId: string): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.baseUrl}/commentaires/article/${articleId}`);
  }

  getParApprentissage(contenuApprentissageId: string): Observable<Commentaire[]> {
    return this.http.get<Commentaire[]>(`${this.baseUrl}/commentaires/apprentissage/${contenuApprentissageId}`);
  }

  creer(data: { articleId?: string; contenuApprentissageId?: string; contenu: string; parentId?: string }): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.baseUrl}/commentaires`, data);
  }

  toggleLike(id: string): Observable<Commentaire> {
    return this.http.post<Commentaire>(`${this.baseUrl}/commentaires/${id}/like`, {});
  }

  count(articleId: string): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(`${this.baseUrl}/commentaires/article/${articleId}/count`);
  }
}
