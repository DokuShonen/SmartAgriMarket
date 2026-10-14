import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ArticleForum, ContenuApprentissage } from '../models/article-forum.model';

@Injectable({ providedIn: 'root' })
export class ForumService extends ApiService {

  getArticles(): Observable<ArticleForum[]> {
    return this.http.get<ArticleForum[]>(`${this.baseUrl}/forum/articles`);
  }

  rechercherArticles(keyword: string): Observable<ArticleForum[]> {
    return this.http.get<ArticleForum[]>(`${this.baseUrl}/forum/articles/recherche?q=${encodeURIComponent(keyword)}`);
  }

  getArticlesByCategorie(categorie: string): Observable<ArticleForum[]> {
    return this.http.get<ArticleForum[]>(`${this.baseUrl}/forum/articles/categorie/${categorie}`);
  }

  createArticle(data: { titre: string; contenu: string; categorie: string }): Observable<ArticleForum> {
    return this.http.post<ArticleForum>(`${this.baseUrl}/forum/articles`, data);
  }

  getApprentissages(): Observable<ContenuApprentissage[]> {
    return this.http.get<ContenuApprentissage[]>(`${this.baseUrl}/forum/apprentissage`);
  }

  getApprentissageById(id: string): Observable<ContenuApprentissage> {
    return this.http.get<ContenuApprentissage>(`${this.baseUrl}/forum/apprentissage/${id}`);
  }

  modererArticle(id: string, estModere: boolean): Observable<ArticleForum> {
    return this.http.patch<ArticleForum>(`${this.baseUrl}/forum/articles/${id}/moderer?estModere=${estModere}`, {});
  }

  supprimerArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/forum/articles/${id}`);
  }

  validerContenu(id: string): Observable<ContenuApprentissage> {
    return this.http.patch<ContenuApprentissage>(`${this.baseUrl}/forum/apprentissage/${id}/valider`, {});
  }

  supprimerApprentissage(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/forum/apprentissage/${id}`);
  }
}
