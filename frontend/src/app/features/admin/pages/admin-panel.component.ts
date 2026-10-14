import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ForumService } from '../../../core/services/forum.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { ProduitVedetteService } from '../../../core/services/produit-vedette.service';
import { CoursSemenceService } from '../../../core/services/cours-semence.service';
import { ProduitService } from '../../../core/services/produit.service';
import { AuthService } from '../../../core/services/auth.service';
import { AdminService, DashboardStats, Signalement } from '../../../core/services/admin.service';
import { ParametreService } from '../../../core/services/parametre.service';
import { BadgeService, Badge } from '../../../core/services/badge.service';
import { ArticleForum, ContenuApprentissage } from '../../../core/models/article-forum.model';
import { Utilisateur } from '../../../core/models/utilisateur.model';
import { Produit } from '../../../core/models/produit.model';
import { Parametre } from '../../../core/models/parametre.model';
import { CoursSemence } from '../../../core/models/cours-semence.model';
import { Message, Conversation } from '../../../core/models/conversation.model';
import { Commentaire } from '../../../core/services/commentaire.service';
import { AdminChartComponent } from '../../../shared/components/admin-chart.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, DecimalPipe, SlicePipe, FormsModule, AdminChartComponent],
  templateUrl: './admin-panel.component.html',
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100dvh;
      background: var(--g-50);
    }

    /* === SIDEBAR === */
    .sidebar {
      width: 240px;
      background: #fff;
      border-right: 1px solid var(--n-100);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 100;
    }
    .sidebar-header {
      padding: 24px 20px 20px;
      border-bottom: 1px solid var(--n-100);
    }
    .sidebar-header h1 {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 2px;
    }
    .sidebar-header p { font-size: 12px; color: var(--text-secondary); }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
    }
    .sidebar-section {
      padding: 0 12px;
      margin-bottom: 8px;
    }
    .sidebar-section-label {
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-dim);
      padding: 8px 8px 4px;
    }
    .sidebar-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px 12px;
      border: none;
      background: none;
      border-radius: 10px;
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      transition: all 0.15s;
      text-align: left;
    }
    .sidebar-item .material-icons-outlined { font-size: 20px; }
    .sidebar-item:hover { background: var(--g-50); color: var(--heading-color); }
    .sidebar-item.active {
      background: var(--brand-light);
      color: var(--brand);
    }
    .sidebar-item .item-badge {
      margin-left: auto;
      background: #ef4444;
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
    }

    .sidebar-footer {
      padding: 16px 20px;
      border-top: 1px solid var(--n-100);
      font-size: 11px;
      color: var(--text-dim);
      text-align: center;
    }

    /* === MAIN CONTENT === */
    .main-content {
      flex: 1;
      margin-left: 240px;
      min-height: 100dvh;
    }
    .content-header {
      background: #fff;
      border-bottom: 1px solid var(--n-100);
      padding: 20px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .content-header h2 {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--heading-color);
    }
    .content-header-meta { font-size: 12px; color: var(--text-secondary); }

    .content-body { padding: 24px 32px; }

    /* === STATS === */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #fff;
      border-radius: 14px;
      padding: 20px;
      border: 1px solid var(--n-100);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon-wrap {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--brand-light);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stat-icon-wrap .material-icons-outlined { font-size: 24px; color: var(--brand); }
    .stat-info { flex: 1; }
    .stat-value {
      font-family: var(--font-display);
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--heading-color);
      line-height: 1.2;
    }
    .stat-label { font-size: 12px; color: var(--text-dim); margin-top: 2px; }

    /* === CHARTS GRID === */
    .charts-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    @media (max-width: 1024px) {
      .charts-grid { grid-template-columns: 1fr; }
    }

    .charts-row {
      display: grid;
      grid-template-columns: 320px 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .charts-row > app-admin-chart:last-child {
      grid-column: 2;
    }
    @media (max-width: 1024px) {
      .charts-row {
        grid-template-columns: 1fr;
      }
      .charts-row > app-admin-chart:last-child {
        grid-column: 1;
      }
    }

    /* === DATA TABLE === */
    .table-wrap {
      background: #fff;
      border-radius: 14px;
      border: 1px solid var(--n-100);
      overflow: hidden;
      margin-bottom: 20px;
    }
    .table-title-bar {
      padding: 16px 20px;
      border-bottom: 1px solid var(--n-100);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }
    .table-title {
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 700;
      color: var(--heading-color);
    }
    .table-search {
      padding: 8px 14px;
      border: 1px solid var(--n-200);
      border-radius: 8px;
      font-size: 13px;
      width: 240px;
      background: var(--g-50);
      transition: border-color 0.2s;
    }
    .table-search:focus { outline: none; border-color: var(--brand); background: #fff; }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }
    .data-table th {
      padding: 12px 20px;
      text-align: left;
      font-family: var(--font-display);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-secondary);
      background: var(--g-50);
      border-bottom: 1px solid var(--n-100);
      white-space: nowrap;
    }
    .data-table td {
      padding: 14px 20px;
      font-size: 13px;
      border-bottom: 1px solid var(--n-100);
      vertical-align: middle;
    }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: var(--g-50); }

    .td-name { font-weight: 700; color: var(--heading-color); white-space: nowrap; }
    .signalement-type { display: flex; flex-direction: column; gap: 3px; }
    .signalement-target { font-weight: 400; font-size: 12px; color: var(--text-secondary); }
    .badge-sm { font-size: 10px; padding: 2px 6px; }
    .td-email { color: var(--text-secondary); }
    .td-loc { color: var(--text-dim); font-size: 12px; }
    .td-actions { display: flex; gap: 6px; }

    /* === BADGES === */
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
    }
    .badge-ok { background: #e8f5e9; color: #2e7d32; }
    .badge-warn { background: #fff3e0; color: #e65100; }
    .badge-red { background: #ffebee; color: #c62828; }
    .badge-blue { background: #e3f2fd; color: #1565c0; }
    .badge-green { background: #e8f5e9; color: #2e7d32; }
    .badge-yellow { background: #fef3c7; color: #b45309; }

    /* === BUTTONS === */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 7px 12px;
      border: none;
      border-radius: 8px;
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .btn:hover { filter: brightness(0.95); }
    .btn:active { transform: scale(0.97); }
    .btn .material-icons-outlined { font-size: 15px; }
    .btn-green { background: #e8f5e9; color: #2e7d32; }
    .btn-orange { background: #fff3e0; color: #e65100; }
    .btn-red { background: #ffebee; color: #c62828; }
    .btn-blue { background: #e3f2fd; color: #1565c0; }
    .btn-outline { background: transparent; border: 1.5px solid var(--n-200); color: var(--text-secondary); }
    .btn-sm { padding: 5px 8px; font-size: 11px; }
    .btn-sm .material-icons-outlined { font-size: 14px; }

    /* === FORMS === */
    .form-card {
      background: #fff;
      border-radius: 14px;
      border: 1px solid var(--n-100);
      padding: 24px;
      margin-bottom: 20px;
    }
    .form-card-title {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 4px;
    }
    .form-card-sub { font-size: 12px; color: var(--text-dim); margin-bottom: 16px; }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
    }
    .form-group { display: flex; flex-direction: column; gap: 4px; }
    .form-group.full { grid-column: 1 / -1; }
    .form-label {
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .form-input, .form-select {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid var(--n-200);
      border-radius: 10px;
      font-size: 14px;
      background: var(--g-50);
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: var(--brand);
      background: #fff;
      box-shadow: 0 0 0 3px rgba(39, 163, 55, 0.08);
    }
    .form-actions { display: flex; gap: 8px; margin-top: 8px; }

    /* === CONTENT PANELS === */
    .panel-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .panel-grid .full-width { grid-column: 1 / -1; }

    /* === EXPANDED ROW === */
    .expand-row {
      background: var(--g-50);
    }
    .expand-row td { padding: 0 !important; }
    .expand-content {
      padding: 16px 20px;
      border-top: 1px solid var(--n-100);
    }
    .expand-text {
      font-size: 13px;
      color: var(--text-secondary);
      line-height: 1.6;
      white-space: pre-wrap;
      background: #fff;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid var(--n-100);
      margin-bottom: 12px;
    }
    .comment-list { margin-top: 8px; }
    .comment-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-bottom: 1px solid var(--n-100);
      font-size: 12px;
    }
    .comment-item:last-child { border-bottom: none; }
    .comment-author { font-weight: 700; color: var(--heading-color); min-width: 80px; }
    .comment-text { flex: 1; color: var(--text-secondary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .comment-date { color: var(--text-dim); white-space: nowrap; }

    /* === MSG PREVIEW === */
    .msg-list { max-height: 300px; overflow-y: auto; }
    .msg-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 0;
      border-bottom: 1px solid var(--n-100);
    }
    .msg-item:last-child { border-bottom: none; }
    .msg-sender { font-weight: 700; font-size: 12px; color: var(--heading-color); min-width: 80px; }
    .msg-body { flex: 1; font-size: 13px; color: var(--text-secondary); }
    .msg-time { font-size: 11px; color: var(--text-dim); white-space: nowrap; }

    /* === EMPTY STATE === */
    .empty-state {
      text-align: center;
      padding: 60px 32px;
      color: var(--text-dim);
    }
    .empty-icon { font-size: 56px; display: block; margin-bottom: 12px; opacity: 0.3; }

    /* === RESPONSIVE: TABLET === */
    @media (max-width: 1200px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .panel-grid { grid-template-columns: 1fr; }
      .form-grid { grid-template-columns: 1fr; }
    }

    /* === RESPONSIVE: MOBILE (fallback) === */
    @media (max-width: 900px) {
      .sidebar { display: none; }
      .main-content { margin-left: 0; }
      .content-body { padding: 16px; }
      .stats-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class AdminPanelComponent implements OnInit {
  onglet: 'forum' | 'apprentissage' | 'utilisateurs' | 'vedettes' | 'cours' | 'parametres' | 'messages' | 'signalements' | 'stats' | 'badges' = 'forum';
  articles: ArticleForum[] = [];
  apprentissages: ContenuApprentissage[] = [];
  utilisateurs: Utilisateur[] = [];
  produits: Produit[] = [];
  coursSemences: CoursSemence[] = [];
  messages: Message[] = [];
  conversations: Conversation[] = [];
  commentaires: Commentaire[] = [];
  signalements: Signalement[] = [];
  parametres: Parametre[] = [];
  stats: DashboardStats | null = null;
  articleSelectionne: string | null = null;
  userMessagesSelection: string | null = null;
  badges: Badge[] = [];
  badgeCommentaires: Record<string, string> = {};

  newCoursProduit = '';
  newCoursPrix = 0;
  newCoursLocalite = '';
  newCoursSource = '';
  editCoursId: string | null = null;

  searchQuery = '';

  // Chart data computed from stats
  get chartLabels(): string[] {
    if (!this.stats?.commandesParMois) return [];
    const mois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    return this.stats.commandesParMois.map(m => `${mois[m.mois - 1]} ${m.annee}`);
  }

  get ordersDataset(): { label: string; data: number[]; color?: string }[] {
    if (!this.stats?.commandesParMois) return [];
    return [{
      label: 'Commandes livrées',
      data: this.stats.commandesParMois.map(m => m.nombreCommandes),
      color: '#27a337'
    }];
  }

  get revenueDataset(): { label: string; data: number[]; color?: string }[] {
    if (!this.stats?.commandesParMois) return [];
    return [{
      label: 'Revenu (FCFA)',
      data: this.stats.commandesParMois.map(m => m.montantTotal),
      color: '#ff8a29'
    }];
  }

  // Doughnut: répartition utilisateurs
  get userDistributionLabels(): string[] {
    return ['Producteurs', 'Acheteurs', 'Autres'];
  }

  get userDistributionDataset(): { label: string; data: number[]; color?: string }[] {
    if (!this.stats) return [];
    const autres = this.stats.totalUtilisateurs - this.stats.totalProducteurs - this.stats.totalAcheteurs;
    return [{
      label: 'Utilisateurs',
      data: [
        this.stats.totalProducteurs,
        this.stats.totalAcheteurs,
        Math.max(0, autres)
      ]
    }];
  }

  // Mixed: commandes bar + revenu moyen line
  get mixedDataset(): { label: string; data: number[]; color?: string; type?: 'bar' | 'line' }[] {
    if (!this.stats?.commandesParMois) return [];
    const avgRevenue = this.stats.commandesParMois.map(m =>
      m.nombreCommandes > 0 ? Math.round(m.montantTotal / m.nombreCommandes) : 0
    );
    return [
      {
        label: 'Commandes',
        data: this.stats.commandesParMois.map(m => m.nombreCommandes),
        color: '#27a337',
        type: 'bar'
      },
      {
        label: 'Revenu moyen / commande (FCFA)',
        data: avgRevenue,
        color: '#ff8a29',
        type: 'line'
      }
    ];
  }

  // Cumulative revenue
  get cumulativeRevenueLabels(): string[] {
    return this.chartLabels;
  }

  get cumulativeRevenueDataset(): { label: string; data: number[]; color?: string; fillColor?: string }[] {
    if (!this.stats?.commandesParMois) return [];
    let cumulative = 0;
    const cumulativeData = this.stats.commandesParMois.map(m => {
      cumulative += m.montantTotal;
      return cumulative;
    });
    return [{
      label: 'Revenu cumulé (FCFA)',
      data: cumulativeData,
      color: '#7c3aed',
      fillColor: 'rgba(124, 58, 237, 0.12)'
    }];
  }

  constructor(
    private forumService: ForumService,
    private utilisateurService: UtilisateurService,
    private produitVedetteService: ProduitVedetteService,
    private coursSemenceService: CoursSemenceService,
    private produitService: ProduitService,
    private adminService: AdminService,
    private parametreService: ParametreService,
    private authService: AuthService,
    private badgeService: BadgeService,
    private route: ActivatedRoute
  ) {}

  get role() { return this.authService.utilisateur()?.type; }

  get estAdmin() { return this.role === 'ADMIN' || this.role === 'SUPER_ADMIN'; }
  get estModerationSupport() { return this.estAdmin || this.role === 'MODERATION_SUPPORT'; }
  get estAdminTechnique() { return this.estAdmin; }

  get messagesParUtilisateur(): { utilisateurId: string; nom: string; messages: Message[] }[] {
    const map = new Map<string, { utilisateurId: string; nom: string; messages: Message[] }>();
    for (const m of this.messages) {
      if (!map.has(m.expediteurId)) {
        map.set(m.expediteurId, { utilisateurId: m.expediteurId, nom: m.expediteurNom, messages: [] });
      }
      map.get(m.expediteurId)!.messages.push(m);
    }
    return Array.from(map.values());
  }

  get filteredUtilisateurs(): Utilisateur[] {
    if (!this.searchQuery) return this.utilisateurs;
    const q = this.searchQuery.toLowerCase();
    return this.utilisateurs.filter(u =>
      u.nom?.toLowerCase().includes(q) ||
      u.prenom?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.localite?.toLowerCase().includes(q)
    );
  }

  get filteredArticles(): ArticleForum[] {
    if (!this.searchQuery) return this.articles;
    const q = this.searchQuery.toLowerCase();
    return this.articles.filter(a =>
      a.titre?.toLowerCase().includes(q) ||
      a.categorie?.toLowerCase().includes(q) ||
      a.auteur?.pseudoForum?.toLowerCase().includes(q)
    );
  }

  get unreadSignalements(): number {
    return this.signalements.filter(s => s.statut === 'EN_ATTENTE').length;
  }

  get pendingBadges(): number {
    return this.badges.length;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) this.onglet = tab;
    });
    this.charger();
  }

  charger() {
    this.forumService.getArticles().subscribe(data => this.articles = data);
    this.forumService.getApprentissages().subscribe(data => this.apprentissages = data);
    this.utilisateurService.getAll().subscribe(data => this.utilisateurs = data);
    this.produitService.search({ page: 0, size: 100 }).subscribe((res: any) => this.produits = res.content);
    this.coursSemenceService.getAll().subscribe(data => this.coursSemences = data);
    this.adminService.getTousLesMessages().subscribe(data => this.messages = data);
    this.adminService.getToutesLesConversations().subscribe(data => this.conversations = data);
    this.adminService.getTousLesCommentaires().subscribe(data => this.commentaires = data);
    this.adminService.getSignalements().subscribe(data => this.signalements = data);
    this.adminService.getStats().subscribe(data => this.stats = data);
    this.parametreService.getAll().subscribe(data => this.parametres = data);
    this.badgeService.getEnAttente().subscribe(data => this.badges = data);
  }

  moderer(id: string, estModere: boolean) {
    this.forumService.modererArticle(id, estModere).subscribe(() => this.charger());
  }

  supprimerArticle(id: string) {
    if (confirm('Supprimer cet article forum ?')) {
      this.forumService.supprimerArticle(id).subscribe(() => this.charger());
    }
  }

  getCommentairesForArticle(articleId: string): Commentaire[] {
    return this.commentaires.filter(c => c.articleId === articleId);
  }

  supprimerCommentaire(id: string) {
    if (confirm('Supprimer ce commentaire ?')) {
      this.adminService.supprimerCommentaire(id).subscribe(() => this.charger());
    }
  }

  supprimerConversation(id: string) {
    if (confirm('Supprimer cette conversation ?')) {
      this.adminService.supprimerConversation(id).subscribe(() => this.charger());
    }
  }

  validerApprentissage(id: string) {
    this.forumService.validerContenu(id).subscribe(() => this.charger());
  }

  supprimerApprentissage(id: string) {
    if (confirm('Supprimer ce contenu d\'apprentissage ?')) {
      this.forumService.supprimerApprentissage(id).subscribe(() => this.charger());
    }
  }

  toggleVerification(id: string) {
    this.utilisateurService.toggleVerification(id).subscribe(() => this.charger());
  }

  toggleSuspension(id: string) {
    this.utilisateurService.toggleSuspension(id).subscribe(() => this.charger());
  }

  supprimerUtilisateur(id: string) {
    if (confirm('Supprimer cet utilisateur ?')) {
      this.utilisateurService.deleteUser(id).subscribe(() => this.charger());
    }
  }

  ajouterProduitVedette(produitId: string) {
    this.produitVedetteService.ajouter(produitId).subscribe(() => this.charger());
  }

  supprimerProduitVedette(id: string) {
    this.produitVedetteService.supprimer(id).subscribe(() => this.charger());
  }

  ajouterOuModifierCours() {
    if (!this.newCoursProduit || !this.newCoursPrix || !this.newCoursLocalite) return;
    const data = {
      produit: this.newCoursProduit,
      prix: this.newCoursPrix,
      localite: this.newCoursLocalite,
      source: this.newCoursSource
    };
    const obs = this.editCoursId
      ? this.coursSemenceService.update(this.editCoursId, data)
      : this.coursSemenceService.create(data);
    obs.subscribe(() => {
      this.newCoursProduit = '';
      this.newCoursPrix = 0;
      this.newCoursLocalite = '';
      this.newCoursSource = '';
      this.editCoursId = null;
      this.charger();
    });
  }

  editCours(c: CoursSemence) {
    this.editCoursId = c.id;
    this.newCoursProduit = c.produit;
    this.newCoursPrix = c.prix;
    this.newCoursLocalite = c.localite;
    this.newCoursSource = c.source;
  }

  annulerEditCours() {
    this.editCoursId = null;
    this.newCoursProduit = '';
    this.newCoursPrix = 0;
    this.newCoursLocalite = '';
    this.newCoursSource = '';
  }

  supprimerCours(id: string) {
    if (confirm('Supprimer ce cours ?')) {
      this.coursSemenceService.supprimer(id).subscribe(() => this.charger());
    }
  }

  supprimerMessage(id: string) {
    this.adminService.supprimerMessage(id).subscribe(() => this.charger());
  }

  updateSignalementStatut(id: string, statut: string) {
    this.adminService.updateSignalementStatut(id, statut).subscribe(() => this.charger());
  }

  saveParametre(cle: string, valeur: string, type?: string, description?: string) {
    this.parametreService.save({ cle, valeur, type, description }).subscribe(() => this.charger());
  }

  getParametre(cle: string): string {
    return this.parametres.find(p => p.cle === cle)?.valeur ?? '';
  }

  traiterBadge(id: string, statut: string) {
    const commentaire = this.badgeCommentaires[id] || '';
    this.badgeService.traiter(id, statut, commentaire).subscribe(() => {
      this.badgeService.getEnAttente().subscribe(data => this.badges = data);
    });
  }
}
