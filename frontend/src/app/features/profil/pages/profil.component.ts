import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, NgSwitch, NgSwitchCase, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { CommandeService } from '../../../core/services/commande.service';
import { Commande } from '../../../core/models/commande.model';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NgFor, NgIf, NgSwitch, NgSwitchCase, DatePipe, DecimalPipe, SlicePipe, RouterLink, FormsModule],
  templateUrl: './profil.component.html',
  styles: [`
    .profil-container { max-width: 800px; margin: 0 auto; padding: 1.5rem 1rem; }
    h2 { font-size: 1.4rem; margin-bottom: 1rem; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.25rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 0.5rem; }
    .tabs button { padding: 0.4rem 1rem; border: none; background: none; cursor: pointer; font-size: 0.9rem; color: #888; font-weight: 500; }
    .tabs button.active { color: #1a5c2a; border-bottom: 2px solid #1a5c2a; }
    .card { background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 1rem; margin-bottom: 0.75rem; }
    .card h3 { font-size: 1rem; margin-bottom: 0.25rem; }
    .card .meta { color: #888; font-size: 0.8rem; }
    .badge { padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 600; }
    .badge.attente { background: #fff3e0; color: #e65100; }
    .badge.confirmee { background: #e3f2fd; color: #1565c0; }
    .badge.livree { background: #e8f5e9; color: #2e7d32; }
    .badge.annulee { background: #ffebee; color: #c62828; }
    .btn-link { color: #1a5c2a; font-size: 0.85rem; }
    .empty { text-align: center; padding: 3rem; color: #888; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.85rem; font-weight: 600; color: #555; }
    .form-group input { padding: 0.6rem; border: 1px solid #ccc; border-radius: 6px; font-size: 0.9rem; }
    .btn-submit { padding: 0.6rem 1.5rem; background: #1a5c2a; color: #fff; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; }
    .btn-submit:disabled { opacity: 0.5; }
    .msg { color: #2e7d32; font-size: 0.85rem; margin-bottom: 0.5rem; }
    .quick-links { display: flex; gap: 1rem; margin: 1rem 0; }
    .quick-links a { padding: 0.6rem 1rem; background: #e8f5e9; color: #1a5c2a; text-decoration: none; border-radius: 8px; font-size: 0.85rem; font-weight: 600; }
  `]
})
export class ProfilComponent implements OnInit {
  onglet: 'commandes' | 'parametres' = 'commandes';
  commandes: Commande[] = [];
  editNom = '';
  editPrenom = '';
  editTelephone = '';
  editLocalite = '';
  message = '';
  enCours = false;

  constructor(
    public auth: AuthService,
    private utilisateurService: UtilisateurService,
    private commandeService: CommandeService
  ) {}

  ngOnInit() {
    this.chargerCommandes();
    const u = this.auth.utilisateur();
    if (u) {
      this.editNom = u.nom;
      this.editPrenom = u.prenom;
      this.editTelephone = u.telephone;
      this.editLocalite = u.localite;
    }
  }

  chargerCommandes() {
    this.commandeService.getMesCommandes().subscribe(data => this.commandes = data);
  }

  statutClass(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE':'attente','CONFIRMEE':'confirmee','EN_PREPARATION':'confirmee','EN_COURS_LIVRAISON':'confirmee','LIVREE':'livree','ANNULEE':'annulee' };
    return map[s] || '';
  }

  sauvegarder() {
    if (this.enCours) return;
    this.enCours = true;
    this.message = '';
    this.utilisateurService.updateMe({
      nom: this.editNom, prenom: this.editPrenom,
      telephone: this.editTelephone, localite: this.editLocalite
    }).subscribe({
      next: () => { this.message = 'Profil mis à jour'; this.enCours = false; },
      error: () => { this.message = 'Erreur'; this.enCours = false; }
    });
  }
}
