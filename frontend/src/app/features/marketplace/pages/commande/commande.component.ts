import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DecimalPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PanierService } from '../../../../core/services/panier.service';
import { CommandeService } from '../../../../core/services/commande.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LogistiqueService } from '../../../../core/services/logistique.service';

@Component({
  selector: 'app-commande',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, RouterLink, FormsModule],
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  items: any[] = [];
  avecLivraison = false;
  adresseLivraison = '';
  notes = '';
  enCours = false;
  success = false;
  erreur = '';
  localisationEnCours = false;
  geolocErreur = '';
  lat = 0;
  lon = 0;
  mapsUrl = '';
  safeMapUrl: SafeResourceUrl = '';
  showMap = false;
  fraisLivraisonEstime = 0;
  distanceEstimee = 0;

  constructor(
    private panierService: PanierService,
    private commandeService: CommandeService,
    private router: Router,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
    private logistiqueService: LogistiqueService
  ) {
    this.items = this.panierService.getSnapshot();
  }

  ngOnInit() {
    const u = this.auth.utilisateur();
    if (u?.localite) {
      this.adresseLivraison = u.localite;
    }
  }

  detecterPosition() {
    if (!navigator.geolocation) {
      this.geolocErreur = 'Votre navigateur ne supporte pas la géolocalisation. Saisissez votre adresse manuellement.';
      return;
    }
    this.localisationEnCours = true;
    this.geolocErreur = '';

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;
        const zoom = 15;
        const bbox = `${this.lon - 0.01},${this.lat - 0.01},${this.lon + 0.01},${this.lat + 0.01}`;
        this.mapsUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${this.lat},${this.lon}`;
        this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.mapsUrl);
        this.showMap = true;

        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.lat}&lon=${this.lon}&accept-language=fr&zoom=18`)
          .then(r => r.json())
          .then(data => {
            if (data && data.display_name) {
              this.adresseLivraison = data.display_name;
            } else {
              this.adresseLivraison = `${this.lat.toFixed(6)}, ${this.lon.toFixed(6)}`;
            }
            this.localisationEnCours = false;
          })
          .catch(() => {
            this.adresseLivraison = `${this.lat.toFixed(6)}, ${this.lon.toFixed(6)}`;
            this.localisationEnCours = false;
          });
      },
      (err) => {
        this.localisationEnCours = false;
        if (err.code === 1) {
          this.geolocErreur = 'Autorisation refusée. Vous pouvez saisir votre adresse manuellement dans le champ ci-dessus.';
        } else if (err.code === 2) {
          this.geolocErreur = 'Position non disponible. Saisissez votre adresse manuellement ou activez la localisation dans les paramètres de votre appareil.';
        } else {
          this.geolocErreur = 'Délai dépassé. Veuillez réessayer ou saisir votre adresse manuellement.';
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  }

  get total(): number {
    return this.items.reduce((s, i) => s + i.produit.prix * i.quantite, 0);
  }

  get totalAvecLivraison(): number {
    return this.total + this.fraisLivraisonEstime;
  }

  onLivraisonChange() {
    if (!this.avecLivraison) {
      this.fraisLivraisonEstime = 0;
      this.distanceEstimee = 0;
      return;
    }
    this.distanceEstimee = 100;
    this.logistiqueService.calculerFrais(this.distanceEstimee).subscribe({
      next: (f) => this.fraisLivraisonEstime = f,
      error: () => this.fraisLivraisonEstime = 5000
    });
  }

  confirmer() {
    if (this.enCours || !this.items.length) return;
    this.enCours = true;

    const lignes = this.items.map(i => ({
      produitId: i.produit.id,
      quantite: i.quantite
    }));

    const data: any = { lignes };
    if (this.avecLivraison) {
      data.avecLivraison = true;
      data.adresseLivraison = this.adresseLivraison;
    }
    data.fraisLivraison = this.fraisLivraisonEstime;
    if (this.notes) data.notes = this.notes;

    this.commandeService.create(data).subscribe({
      next: () => {
        this.success = true;
        this.enCours = false;
        this.panierService.clear();
      },
      error: () => {
        this.enCours = false;
        this.erreur = 'Erreur lors de la création de la commande.';
      }
    });
  }
}
