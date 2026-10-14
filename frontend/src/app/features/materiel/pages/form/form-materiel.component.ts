import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AnnonceMaterielService } from '../../../../core/services/annonce-materiel.service';
import { UploadService } from '../../../../core/services/upload.service';
import { ToastComponent } from '../../../../core/components/toast.component';

@Component({
  selector: 'app-form-materiel',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  template: `
    <form (ngSubmit)="submit()" #form="ngForm" class="materiel-form">
      <div class="form-group">
        <label>Photos du matériel</label>
        <div class="photo-upload-area">
          <div class="photo-preview" *ngIf="photos.length">
            <div class="photo-thumb" *ngFor="let p of photos; let i = index">
              <img [src]="p" alt="Photo {{i+1}}" />
              <button type="button" class="photo-remove" (click)="removePhoto(i)">
                <span class="material-icons-outlined">close</span>
              </button>
            </div>
          </div>
          <label class="upload-btn" [class.has-photos]="photos.length > 0">
            <span class="material-icons-outlined">add_a_photo</span>
            <span>{{ photos.length > 0 ? 'Ajouter une photo' : 'Ajouter des photos' }}</span>
            <input type="file" accept="image/*" multiple (change)="onFileSelected($event)" hidden />
          </label>
          <p class="upload-hint" *ngIf="!photos.length">JPG, PNG ou WebP. Max 5 photos.</p>
        </div>
      </div>

      <div class="form-group">
        <label>Titre *</label>
        <input type="text" [(ngModel)]="titre" name="titre" required placeholder="Nom du matériel" />
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea [(ngModel)]="description" name="description" rows="3" placeholder="Décrivez votre matériel..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Type *</label>
          <select [(ngModel)]="typeTransaction" name="typeTransaction" required (change)="typeChanged()">
            <option value="VENTE">Vente</option>
            <option value="LOCATION">Location</option>
          </select>
        </div>
        <div class="form-group">
          <label>État *</label>
          <select [(ngModel)]="etat" name="etat" required>
            <option value="NEUF">Neuf</option>
            <option value="OCCASION">Occasion</option>
          </select>
        </div>
      </div>
      <div class="form-group" *ngIf="typeTransaction === 'LOCATION'">
        <label>Durée de location</label>
        <input type="text" [(ngModel)]="duree" name="duree" placeholder="Ex: Journée, Semaine, 3 jours" />
      </div>
      <div class="form-group" *ngIf="typeTransaction === 'LOCATION'">
        <label>Caution (FCFA)</label>
        <input type="number" [(ngModel)]="caution" name="caution" min="0" placeholder="Montant caution" />
      </div>
      <div class="form-group" *ngIf="typeTransaction === 'LOCATION'">
        <label>Disponibilités</label>
        <input type="text" [(ngModel)]="disponibilites" name="disponibilites" placeholder="Ex: Lundi-Vendredi 8h-18h" />
      </div>
      <div class="form-group">
        <label>Prix (FCFA) {{ typeTransaction === 'LOCATION' ? '(par jour/semaine)' : '' }}</label>
        <input type="number" [(ngModel)]="prix" name="prix" [required]="typeTransaction === 'LOCATION'" min="0" placeholder="0" />
      </div>
      <div class="form-group">
        <label>Localité *</label>
        <input type="text" [(ngModel)]="localite" name="localite" required placeholder="Ville" />
      </div>
      <div class="form-actions">
        <button type="button" class="btn-cancel" (click)="cancelled.emit()" *ngIf="isModal">Annuler</button>
        <button type="submit" class="btn-submit" [disabled]="enCours || uploadEnCours || !form.valid">
          <span class="material-icons-outlined" *ngIf="!enCours && !uploadEnCours">publish</span>
          {{ submitLabel }}
        </button>
      </div>
    </form>
  `,
  styles: [`
    .materiel-form { padding: 0.5rem 0; }
    .form-group { display: flex; flex-direction: column; gap: 0.3rem; margin-bottom: 1rem; }
    .form-group label { font-size: 0.82rem; font-weight: 600; color: var(--text-secondary); }
    .form-group input, .form-group select, .form-group textarea { padding: 0.65rem 0.75rem; border: 1px solid var(--n-200); border-radius: var(--radius); font-size: 0.88rem; background: #fafafa; transition: border-color 0.2s; font-family: inherit; }
    .form-group input:focus, .form-group select:focus, .form-group textarea:focus { outline: none; border-color: var(--brand); background: #fff; }
    .form-row { display: flex; gap: 1rem; }
    .form-row .form-group { flex: 1; }
    .form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 0.5rem; }
    .btn-cancel { padding: 0.6rem 1.2rem; border: 1px solid var(--n-200); background: #fff; border-radius: var(--radius); font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
    .btn-cancel:hover { background: var(--n-100); }
    .btn-submit { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.65rem 1.5rem; background: var(--brand); color: #fff; border: none; border-radius: var(--radius); font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; }
    .btn-submit:hover { background: var(--brand-dark); }
    .btn-submit:disabled { opacity: 0.5; }
    .btn-submit .material-icons-outlined { font-size: 0.95rem; }

    .photo-upload-area { margin-bottom: 0.5rem; }
    .photo-preview { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
    .photo-thumb { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid var(--n-200); }
    .photo-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .photo-remove { position: absolute; top: 2px; right: 2px; width: 20px; height: 20px; background: rgba(0,0,0,0.6); color: #fff; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; padding: 0; }
    .photo-remove .material-icons-outlined { font-size: 14px; }
    .upload-btn { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.6rem 1rem; border: 2px dashed var(--n-300); border-radius: var(--radius); cursor: pointer; transition: all 0.2s; font-size: 0.85rem; color: var(--text-secondary); }
    .upload-btn:hover { border-color: var(--brand); color: var(--brand); background: var(--g-50); }
    .upload-btn.has-photos { border-style: solid; }
    .upload-btn .material-icons-outlined { font-size: 1.1rem; }
    .upload-hint { font-size: 0.75rem; color: var(--text-dim); margin-top: 0.3rem; }
  `]
})
export class FormMaterielComponent {
  @Input() editId: string | null = null;
  @Input() initialData: any = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get isModal(): boolean { return !!this.saved.observers.length; }

  titre = '';
  description = '';
  prix = 0;
  typeTransaction = 'VENTE';
  etat = 'OCCASION';
  localite = '';
  duree = '';
  caution = 0;
  disponibilites = '';
  photos: string[] = [];
  enCours = false;
  uploadEnCours = false;

  constructor(
    private service: AnnonceMaterielService,
    private uploadService: UploadService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.initialData) {
      this.titre = this.initialData.titre || '';
      this.description = this.initialData.description || '';
      this.prix = this.initialData.prix || 0;
      this.typeTransaction = this.initialData.typeTransaction || 'VENTE';
      this.etat = this.initialData.etat || 'OCCASION';
      this.localite = this.initialData.localite || '';
      this.duree = this.initialData.duree || '';
      this.caution = this.initialData.caution || 0;
      this.disponibilites = this.initialData.disponibilites || '';
      this.photos = this.initialData.photos || [];
    }
  }

  get submitLabel(): string {
    if (this.uploadEnCours) return 'Upload en cours...';
    if (this.enCours) return 'Publication...';
    return this.editId ? 'Modifier l\'annonce' : 'Publier l\'annonce';
  }

  typeChanged() {
    if (this.typeTransaction !== 'LOCATION') {
      this.duree = '';
      this.caution = 0;
      this.disponibilites = '';
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);
    const remaining = 5 - this.photos.length;
    const toUpload = files.slice(0, remaining);

    this.uploadEnCours = true;
    let uploaded = 0;

    toUpload.forEach(file => {
      this.uploadService.upload(file).subscribe({
        next: (res) => {
          this.photos.push(res.url);
          uploaded++;
          if (uploaded === toUpload.length) this.uploadEnCours = false;
        },
        error: () => {
          uploaded++;
          if (uploaded === toUpload.length) this.uploadEnCours = false;
          ToastComponent.show('Erreur lors de l\'upload', 'error');
        }
      });
    });

    input.value = '';
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  submit() {
    if (this.enCours || this.uploadEnCours) return;
    this.enCours = true;
    const data: any = {
      titre: this.titre, description: this.description,
      prix: this.prix || null, typeTransaction: this.typeTransaction,
      etat: this.etat, localite: this.localite,
      photos: this.photos
    };
    if (this.typeTransaction === 'LOCATION') {
      data.duree = this.duree;
      data.caution = this.caution || null;
      data.disponibilites = this.disponibilites;
    }

    const req = this.editId
      ? this.service.update(this.editId, data)
      : this.service.create(data);

    req.subscribe({
      next: () => {
        ToastComponent.show(this.editId ? 'Annonce modifiée !' : 'Annonce publiée !', 'success');
        if (this.isModal) { this.saved.emit(); }
        else { this.router.navigate(['/materiel']); }
      },
      error: () => { this.enCours = false; ToastComponent.show('Erreur lors de la publication', 'error'); }
    });
  }
}
