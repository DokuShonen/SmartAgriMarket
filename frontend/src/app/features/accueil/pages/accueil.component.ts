import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { NgFor, NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { retry, switchMap, take } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { LoadingComponent } from '../../../core/components/loading.component';
import { Produit } from '../../../core/models/produit.model';
import { Categorie } from '../../../core/models/categorie.model';
import { CoursSemence } from '../../../core/models/cours-semence.model';
import { ProduitVedette } from '../../../core/models/produit-vedette.model';
import { ProduitService, PageResponse } from '../../../core/services/produit.service';
import { CategorieService } from '../../../core/services/categorie.service';
import { CoursSemenceService } from '../../../core/services/cours-semence.service';
import { ProduitVedetteService } from '../../../core/services/produit-vedette.service';
import { AuthService } from '../../../core/services/auth.service';
import { PanierService } from '../../../core/services/panier.service';
import { BackendHealthService } from '../../../core/services/backend-health.service';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [NgFor, NgIf, DecimalPipe, DatePipe, RouterLink, FormsModule, LoadingComponent],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent implements OnInit, AfterViewInit, OnDestroy {
  categories: Categorie[] = [];
  produitsVedettes: ProduitVedette[] = [];
  coursSemences: CoursSemence[] = [];
  derniersProduits: Produit[] = [];
  searchQuery = '';
  visible = false;
  panierCount = 0;
  chargement = true;
  erreur = '';
  messageChargement = 'Chargement des données...';

  // Slideshow
  slideIndex = 0;
  private slideTimer: any;
  private swipeStartX = 0;
  slides = [
    {
      image: 'assets/hero-market.jpg',
      titre: 'Frais de la <em>plantation</em>,<br>livré chez vous',
      description: 'Achetez directement aux producteurs. Pas d\'intermédiaire, des prix justes, des produits fraîchement récoltés.',
      badge: 'Marketplace agricole',
      lien: '/produits',
      cta: 'Parcourir les produits'
    },
    {
      image: 'assets/product-tomate.jpg',
      titre: 'Produits <em>frais</em> garantis',
      description: 'Des legumes et fruits cueillis le matin meme, livres chez vous.',
      badge: 'Populaire',
      lien: '/produits',
      cta: 'Voir les produits'
    },
    {
      image: 'assets/product-miel.jpg',
      titre: 'Miel & <em>derives</em> locaux',
      description: 'Le miel pur de nos apiculteurs, recolte responsable.',
      badge: 'Bio',
      lien: '/produits',
      cta: 'Decouvrir'
    }
  ];

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private coursSemenceService: CoursSemenceService,
    private produitVedetteService: ProduitVedetteService,
    public auth: AuthService,
    private panierService: PanierService,
    private backendHealth: BackendHealthService
  ) {}

  ngOnInit() {
    this.charger();
  }

  charger() {
    this.chargement = true;
    this.erreur = '';
    this.messageChargement = 'Chargement des données...';

    forkJoin({
      categories: this.categorieService.getAll().pipe(retry(2)),
      vedettes: this.produitVedetteService.getActifs().pipe(retry(2)),
      prix: this.coursSemenceService.getAll().pipe(retry(2)),
      panierItems: this.panierService.getItems().pipe(take(1)),
      produits: this.produitService.search({ page: 0, size: 8 }).pipe(retry(2))
    }).subscribe({
      next: res => {
        if (!res) return;
        this.categories = res.categories;
        this.produitsVedettes = res.vedettes;
        this.coursSemences = res.prix;
        this.panierCount = res.panierItems.reduce((sum, i) => sum + i.quantite, 0);
        this.derniersProduits = res.produits.content;
        this.chargement = false;
        
        // Initialiser les animations après l'affichage des éléments dans le DOM
        setTimeout(() => this.setupScrollReveal(), 100);
      },
      error: () => {
        this.chargement = false;
        this.erreur = 'Erreur lors du chargement. Vérifiez que le backend est démarré.';
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.visible = true, 100);
    this.startSlideTimer();
  }

  ngOnDestroy() {
    this.stopSlideTimer();
  }

  // Slideshow
  startSlideTimer() {
    this.stopSlideTimer();
    this.slideTimer = setInterval(() => this.nextSlide(), 5000);
  }

  stopSlideTimer() {
    if (this.slideTimer) clearInterval(this.slideTimer);
  }

  nextSlide() {
    this.slideIndex = (this.slideIndex + 1) % this.slides.length;
  }

  prevSlide() {
    this.slideIndex = (this.slideIndex - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(i: number) {
    this.slideIndex = i;
    this.startSlideTimer();
  }

  onSwipeStart(e: TouchEvent) {
    this.swipeStartX = e.touches[0].clientX;
  }

  onSwipeEnd(e: TouchEvent) {
    const diff = this.swipeStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? this.nextSlide() : this.prevSlide();
      this.startSlideTimer();
    }
  }

  get isProducteur(): boolean {
    return this.auth.utilisateur()?.type === 'PRODUCTEUR';
  }

  get isAcheteur(): boolean {
    return this.auth.utilisateur()?.type === 'ACHETEUR';
  }

  get isAdmin(): boolean {
    const t = this.auth.utilisateur()?.type;
    return t === 'ADMIN' || t === 'SUPER_ADMIN' || t === 'MODERATION_SUPPORT';
  }

  get userRole(): string {
    return this.auth.utilisateur()?.type || '';
  }

  get greetName(): string {
    const u = this.auth.utilisateur();
    return u?.prenom || '';
  }

  private setupScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    setTimeout(() => {
      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }, 200);
  }

  getCategoryIcon(nom: string): string {
    const icons: Record<string, string> = {
      'Fruits frais': 'spa',
      'Légumes': 'eco',
      'Céréales & tubercules': 'grass',
      'Produits transformés': 'inventory_2',
      'Volaille & élevage': 'pets',
      'Semences & plants': 'yard',
      'Épices & condiments': 'local_fire_department',
      'Miel & dérivés': 'hive'
    };
    return icons[nom] || 'category';
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

  getProductImage(produit: Produit, index: number): string {
    if (produit?.photos?.length) return produit.photos[0];
    const lower = produit?.titre?.toLowerCase() || '';
    for (const [key, img] of Object.entries(this.imageMap)) {
      if (lower.includes(key)) return img;
    }
    return this.fallbackImages[index % this.fallbackImages.length];
  }
}
