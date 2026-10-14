import { Component, OnInit, inject } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { retry, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadingComponent } from '../../../../core/components/loading.component';
import { AnnonceMateriel } from '../../../../core/models/annonce-materiel.model';
import { AnnonceMaterielService } from '../../../../core/services/annonce-materiel.service';
import { ModalComponent } from '../../../../core/components/modal.component';
import { FormMaterielComponent } from '../form/form-materiel.component';
import { BackendHealthService } from '../../../../core/services/backend-health.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-bourse-materiel',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, FormsModule, ModalComponent, FormMaterielComponent, LoadingComponent],
  templateUrl: './bourse-materiel.component.html',
  styleUrls: ['./bourse-materiel.component.css']
})
export class BourseMaterielComponent implements OnInit {
  annonces: AnnonceMateriel[] = [];
  filtreType = '';
  showForm = false;
  editAnnonce: AnnonceMateriel | null = null;
  chargement = true;
  erreur = '';

  constructor(
    private service: AnnonceMaterielService,
    private backendHealth: BackendHealthService,
    private auth: AuthService
  ) {}

  get peutPublier(): boolean {
    const t = this.auth.utilisateur()?.type;
    return t === 'PRODUCTEUR' || t === 'ADMIN' || t === 'SUPER_ADMIN' || t === 'MODERATION_SUPPORT';
  }

  isOwner(a: AnnonceMateriel): boolean {
    const userId = this.auth.utilisateur()?.id;
    return !!userId && a.vendeurId === userId;
  }

  openEdit(a: AnnonceMateriel) {
    this.editAnnonce = a;
  }

  supprimer(a: AnnonceMateriel) {
    if (!confirm('Supprimer cette annonce ?')) return;
    this.service.delete(a.id).subscribe({
      next: () => this.load(),
      error: () => alert('Erreur lors de la suppression.')
    });
  }

  ngOnInit() { this.load(); }

  load() {
    this.chargement = true;
    this.erreur = '';
    this.backendHealth.waitForBackend(2000, 15).pipe(
      switchMap((ready) => {
        if (!ready) {
          this.chargement = false;
          this.erreur = 'Serveur non disponible.';
          return of(null);
        }
        return this.service.getAll();
      })
    ).pipe(retry(3)).subscribe({
      next: data => { if (data) { this.annonces = data; this.chargement = false; } },
      error: () => { this.chargement = false; this.erreur = 'Serveur non disponible.'; }
    });
  }

  get filtrees(): AnnonceMateriel[] {
    if (!this.filtreType) return this.annonces;
    return this.annonces.filter(a => a.typeTransaction === this.filtreType);
  }
}
