import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthResponse } from '../models/auth-response.model';
import { Utilisateur } from '../models/utilisateur.model';
import { PanierService } from './panier.service';

@Injectable({ providedIn: 'root' })
export class AuthService extends ApiService {
  private readonly TOKEN_KEY = 'smartagri_token';
  private readonly USER_KEY = 'smartagri_user';
  private panierService = inject(PanierService);

  utilisateur = signal<Utilisateur | null>(
    (() => {
      const saved = localStorage.getItem('smartagri_user');
      return saved ? JSON.parse(saved) : null;
    })()
  );

  constructor() {
    super();
    const u = this.utilisateur();
    if (u) this.panierService.setUserId(u.id);
  }

  register(data: {
    nom: string; prenom: string; email: string; telephone: string;
    motDePasse: string; localite: string; type: string;
    cnib?: string; cooperative?: string; photoCertificationBio?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data)
      .pipe(tap(r => this.sauvegarderSession(r)));
  }

  login(data: { email: string; motDePasse: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(tap(r => this.sauvegarderSession(r)));
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, {})
      .pipe(tap(r => this.sauvegarderSession(r)));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/forgot-password`, { email });
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.utilisateur.set(null);
    this.panierService.setUserId(null);
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
    this.panierService.setUserId(r.utilisateur.id);
  }
}
