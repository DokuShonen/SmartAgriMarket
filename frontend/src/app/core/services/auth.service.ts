import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response.model';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly TOKEN_KEY = 'smartagri_token';
  private readonly USER_KEY = 'smartagri_user';

  utilisateur = signal<Utilisateur | null>(
    (() => {
      const saved = localStorage.getItem('smartagri_user');
      return saved ? JSON.parse(saved) : null;
    })()
  );

  register(data: {
    nom: string; prenom: string; email: string; telephone: string;
    motDePasse: string; localite: string; type: string
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data)
      .pipe(tap(r => this.sauvegarderSession(r)));
  }

  login(data: { email: string; motDePasse: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(tap(r => this.sauvegarderSession(r)));
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.utilisateur.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  private sauvegarderSession(r: AuthResponse) {
    localStorage.setItem(this.TOKEN_KEY, r.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(r.utilisateur));
    this.utilisateur.set(r.utilisateur);
  }
}
