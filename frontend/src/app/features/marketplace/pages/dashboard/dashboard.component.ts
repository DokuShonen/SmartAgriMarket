import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Produit } from '../../../../core/models/produit.model';
import { ProduitService } from '../../../../core/services/produit.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ModalComponent } from '../../../../core/components/modal.component';
import { ProduitFormComponent } from '../produit-form/produit-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, RouterLink, ModalComponent, ProduitFormComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  produits: Produit[] = [];
  showForm = false;
  editingId: string | null = null;

  readonly TYPES_AUTORISES = ['PRODUCTEUR', 'ADMIN', 'SUPER_ADMIN', 'MODERATION_SUPPORT'];

  constructor(
    private produitService: ProduitService,
    public auth: AuthService
  ) {}

  get peutPublier(): boolean {
    const u = this.auth.utilisateur();
    return !!u && this.TYPES_AUTORISES.includes(u.type);
  }

  ngOnInit() { this.load(); }

  load() { this.produitService.getMesProduits().subscribe(data => this.produits = data); }

  getStockTotal(): number { return this.produits.reduce((s, p) => s + p.quantiteDisponible, 0); }

  showEditForm(p: Produit) { this.editingId = p.id; this.showForm = true; }

  closeForm() { this.showForm = false; this.editingId = null; this.load(); }

  toggleProduit(id: string) {
    this.produitService.toggleActif(id).subscribe(() => this.load());
  }

  supprimer(id: string) {
    if (confirm('Supprimer cette annonce ?')) {
      this.produitService.delete(id).subscribe(() => this.load());
    }
  }
}
