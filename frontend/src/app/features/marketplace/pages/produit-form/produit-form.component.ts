import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Categorie } from '../../../../core/models/categorie.model';
import { CategorieService } from '../../../../core/services/categorie.service';
import { ProduitService } from '../../../../core/services/produit.service';
import { UploadService } from '../../../../core/services/upload.service';
import { ToastComponent } from '../../../../core/components/toast.component';

@Component({
  selector: 'app-produit-form',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: 'produit-form.component.html',
  styles: [`
    .produit-form { padding: 0.5rem 0; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); }
    .form-group input, .form-group select, .form-group textarea { padding: 0.65rem 0.75rem; border: 1px solid #e5e5e5; border-radius: 8px; font-size: 0.88rem; background: #fafafa; transition: border-color 0.2s; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--green-500); background: #fff; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    .upload-area { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
    .upload-area input[type=\"file\"] { font-size: 0.82rem; }
    .photos-list { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .photo-item { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #e5e5e5; }
    .photo-preview { width: 100%; height: 100%; object-fit: cover; }
    .btn-remove-photo { position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; border: none; font-size: 14px; line-height: 1; cursor: pointer; display: flex; align-items: center; justify-content: center; }
    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
    .btn-cancel { padding: 0.6rem 1.2rem; border: 1px solid #e5e5e5; background: #fff; border-radius: 8px; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
    .btn-cancel:hover { background: #f5f5f5; }
    .btn-submit { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.5rem; background: var(--green-700); color: #fff; border: none; border-radius: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-submit:hover { background: var(--green-800); }
    .btn-submit:disabled { opacity: 0.5; }
    .btn-submit .material-icons-outlined { font-size: 0.95rem; }
  `]
})
export class ProduitFormComponent implements OnInit {
  @Input() editId: string | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get isModal(): boolean { return !!this.saved.observers.length; }

  editionId: string | null = null;
  categories: Categorie[] = [];
  titre = '';
  description = '';
  prix = 0;
  uniteVente = '';
  quantiteDisponible = 1;
  categorieId = '';
  localite = '';
  conditionsLivraison = '';
  dateRecolte = '';
  ficheTechnique = '';
  enCours = false;
  photos: string[] = [];
  uploadEnCours = false;

  constructor(
    private categorieService: CategorieService,
    private produitService: ProduitService,
    private uploadService: UploadService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categorieService.getAll().subscribe(data => this.categories = data);

    const routeId = this.route.snapshot.paramMap.get('id');
    this.editionId = this.editId || routeId;

    if (this.editionId) {
      this.produitService.getById(this.editionId).subscribe(p => {
        this.titre = p.titre;
        this.description = p.description;
        this.prix = p.prix;
        this.uniteVente = p.uniteVente;
        this.quantiteDisponible = p.quantiteDisponible;
        this.categorieId = p.categorieId;
        this.localite = p.localite;
        this.conditionsLivraison = p.conditionsLivraison;
        this.photos = p.photos || [];
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (!file) return;
    this.uploadEnCours = true;
    this.uploadService.upload(file).subscribe({
      next: (res: any) => {
        this.photos.push(res.url);
        this.uploadEnCours = false;
      },
      error: () => {
        this.uploadEnCours = false;
        ToastComponent.show('Erreur lors du téléchargement de l\'image', 'error');
      }
    });
  }

  supprimerPhoto(url: string) {
    this.photos = this.photos.filter(p => p !== url);
  }

  submit() {
    if (this.enCours) return;
    this.enCours = true;

    const data: any = {
      titre: this.titre, description: this.description, prix: this.prix,
      uniteVente: this.uniteVente, quantiteDisponible: this.quantiteDisponible,
      categorieId: this.categorieId, localite: this.localite,
      conditionsLivraison: this.conditionsLivraison,
      dateRecolte: this.dateRecolte || null,
      ficheTechnique: this.ficheTechnique || null,
      photos: this.photos
    };

    const request = this.editionId
      ? this.produitService.update(this.editionId, data)
      : this.produitService.create(data);

    request.subscribe({
      next: () => {
        ToastComponent.show(this.editionId ? 'Produit modifié !' : 'Produit publié !', 'success');
        if (this.isModal) {
          this.saved.emit();
        } else {
          this.router.navigate(['/produits/dashboard']);
        }
      },
      error: () => { this.enCours = false; ToastComponent.show('Erreur lors de l\'enregistrement', 'error'); }
    });
  }
}
