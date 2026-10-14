import { Component, OnInit } from '@angular/core';
import { NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Produit } from '../../../../core/models/produit.model';
import { ProduitService } from '../../../../core/services/produit.service';
import { PanierService } from '../../../../core/services/panier.service';
import { AuthService } from '../../../../core/services/auth.service';
import { MessagerieService } from '../../../../core/services/messagerie.service';
import { SignalementService } from '../../../../core/services/signalement.service';

@Component({
  selector: 'app-detail-produit',
  standalone: true,
  imports: [NgIf, DecimalPipe, DatePipe, RouterLink, FormsModule],
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css']
})
export class DetailProduitComponent implements OnInit {
  produit?: Produit;
  quantite = 1;
  ajouteAuPanier = false;
  signalementVisible = false;
  signalementMotif = '';
  signalementEnCours = false;
  signalementMessage = '';
  signalementSucces = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService,
    private panierService: PanierService,
    public authService: AuthService,
    private messagerieService: MessagerieService,
    private signalementService: SignalementService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.produitService.getById(id).subscribe(data => {
      this.produit = data;
    });
  }

  goBack() { window.history.back(); }

  ajouterAuPanier() {
    if (!this.produit) return;
    this.panierService.add(this.produit, this.quantite);
    this.ajouteAuPanier = true;
    setTimeout(() => this.ajouteAuPanier = false, 2000);
  }

  decrementer() { if (this.quantite > 1) this.quantite--; }

  incrementer() {
    if (this.produit && this.quantite < this.produit.quantiteDisponible) this.quantite++;
  }

  envoyerMessage() {
    if (!this.produit?.vendeurId) return;
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }
    this.messagerieService.createConversation(this.produit.vendeurId, this.produit.id).subscribe({
      next: (conv) => {
        this.messagerieService.sendMessage('Bonjour, je suis intéressé(e) par votre produit.', conv.id).subscribe({
          next: () => {
            this.router.navigate(['/messagerie', conv.id]);
          },
          error: () => {
            this.router.navigate(['/messagerie', conv.id]);
          }
        });
      },
      error: (err) => {
        console.error('Erreur création conversation:', err);
      }
    });
  }

  signaler() {
    if (this.signalementEnCours || !this.signalementMotif || !this.produit) return;
    this.signalementEnCours = true;
    this.signalementSucces = false;
    this.signalementService.create({
      typeCible: 'PRODUIT',
      cibleId: this.produit.id,
      motif: this.signalementMotif
    }).subscribe({
      next: () => {
        this.signalementMessage = 'Signalement envoyé. Notre équipe va examiner votre signalement.';
        this.signalementSucces = true;
        this.signalementMotif = '';
        this.signalementEnCours = false;
      },
      error: () => {
        this.signalementSucces = false;
        this.signalementEnCours = false;
        this.signalementMessage = 'Erreur lors de l\'envoi du signalement.';
      }
    });
  }

  private imageMap: Record<string, string> = {
    'banane': 'assets/product-banana.jpg',
    'igname': 'assets/product-igname.jpg',
    'tomate': 'assets/product-tomate.jpg',
    'poulet': 'assets/product-poulet.jpg',
    'huile': 'assets/product-huile.jpg',
    'miel': 'assets/product-miel.jpg',
    'manioc': 'assets/product-manioc.jpg',
    'piment': 'assets/product-piment.jpg',
    'maïs': 'assets/product-mais.jpg',
    'attiéké': 'assets/product-attieke.jpg',
    'oeuf': 'assets/product-oeuf.jpg',
    'œuf': 'assets/product-oeuf.jpg',
    'gingembre': 'assets/product-gingembre.jpg',
    'bissap': 'assets/product-jus.jpg',
    'aubergine': 'assets/product-aubergine.jpg',
    'cajou': 'assets/product-cajou.jpg',
    'noix': 'assets/product-cajou.jpg',
    'riz': 'assets/product-riz.jpg',
    'orange': 'assets/product-orange.jpg',
    'avocat': 'assets/product-avocat.jpg',
    'blé': 'assets/product-ble.jpg',
    'ble': 'assets/product-ble.jpg'
  };

  private fallbackImages = [
    'assets/product-banana.jpg',
    'assets/product-mais.jpg',
    'assets/product-tomate.jpg',
    'assets/product-igname.jpg',
    'assets/product-miel.jpg',
    'assets/product-poulet.jpg'
  ];

  getProductImage(): string {
    if (this.produit?.photos?.length) return this.produit.photos[0];
    const lower = this.produit?.titre?.toLowerCase() || '';
    for (const [key, img] of Object.entries(this.imageMap)) {
      if (lower.includes(key)) return img;
    }
    const hash = this.produit?.titre ? this.produit.titre.charCodeAt(0) : 0;
    return this.fallbackImages[hash % this.fallbackImages.length];
  }
}
