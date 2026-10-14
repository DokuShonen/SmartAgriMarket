import { Component, OnInit, ViewChild, ElementRef, inject, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor, DatePipe, DecimalPipe, SlicePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UtilisateurService } from '../../../core/services/utilisateur.service';
import { CommandeService } from '../../../core/services/commande.service';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { EvaluationService, Evaluation } from '../../../core/services/evaluation.service';
import { UploadService } from '../../../core/services/upload.service';
import { BadgeService, Badge } from '../../../core/services/badge.service';
import { Commande } from '../../../core/models/commande.model';
import { ToastComponent } from '../../../core/components/toast.component';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, DecimalPipe, SlicePipe, RouterLink, FormsModule],
  templateUrl: './profil.component.html',
  styles: [`
    .profile-page {
      min-height: 100dvh;
      background: var(--g-50);
      padding-bottom: 80px;
    }

    /* === STICKY HEADER === */
    .profile-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #fff;
      border-bottom: 1px solid var(--n-100);
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .profile-avatar-wrap {
      position: relative;
      width: 56px;
      height: 56px;
      flex-shrink: 0;
      cursor: pointer;
    }
    .profile-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--brand-light);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 2px solid var(--n-200);
    }
    .profile-avatar.has-photo { background-size: cover; background-position: center; }
    .profile-avatar .material-icons-outlined { font-size: 26px; color: var(--brand); }
    .profile-avatar .avatar-initial {
      font-family: var(--font-display);
      font-size: 22px;
      font-weight: 700;
      color: var(--brand);
      line-height: 1;
    }
    .profile-avatar .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .avatar-edit {
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 22px;
      height: 22px;
      background: var(--brand);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #fff;
    }
    .avatar-edit .material-icons-outlined { font-size: 11px; color: #fff; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .profile-info { flex: 1; min-width: 0; }
    .profile-info h1 {
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--heading-color);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .profile-role { font-size: 12px; color: var(--text-secondary); }
    .profile-badges { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 4px; }
    .profile-badge-item {
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 700;
    }

    /* === QUICK ACTIONS (scrollable pills) === */
    .quick-actions {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .quick-actions::-webkit-scrollbar { display: none; }
    .action-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 12px;
      text-decoration: none;
      color: var(--heading-color);
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
      flex-shrink: 0;
      min-height: 44px;
      transition: all 0.15s;
    }
    .action-pill:active { background: var(--g-50); transform: scale(0.97); }
    .action-pill:hover { background: var(--g-50); }
    .action-pill .material-icons-outlined { font-size: 18px; color: var(--brand); }

    /* === CONTENT AREA === */
    .content-area { padding: 0 16px; }

    /* === TAB CONTENT === */
    .tab-content { min-height: 300px; padding-top: 12px; }

    /* === ORDERS === */
    .order-list { display: flex; flex-direction: column; gap: 10px; }
    .order-card {
      display: block;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 14px;
      padding: 16px;
      text-decoration: none;
      color: inherit;
      min-height: 44px;
    }
    .order-card:active { background: var(--g-50); }
    .order-card:hover { background: var(--g-50); }
    .order-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .order-id { font-family: var(--font-display); font-size: 14px; font-weight: 700; color: var(--heading-color); }
    .badge { padding: 3px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; }
    .badge.attente { background: #fef3c7; color: #b45309; }
    .badge.confirmee { background: #dbeafe; color: #1d4ed8; }
    .badge.preparation { background: #f3e8ff; color: #7c3aed; }
    .badge.livraison { background: #d1fae5; color: #059669; }
    .badge.livree { background: #d1fae5; color: #059669; }
    .badge.annulee { background: #fee2e2; color: #dc2626; }
    .order-items { font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; line-height: 1.4; }
    .order-bottom { display: flex; justify-content: space-between; align-items: center; }
    .order-bottom strong { font-family: var(--font-display); font-size: 15px; color: var(--brand); }
    .order-date { font-size: 12px; color: var(--text-dim); }

    /* === NOTIFICATIONS === */
    .notif-toolbar {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }
    .toolbar-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 14px;
      border: 1px solid var(--n-200);
      background: #fff;
      border-radius: 10px;
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 600;
      color: var(--brand);
      cursor: pointer;
      min-height: 40px;
    }
    .toolbar-btn .material-icons-outlined { font-size: 14px; }
    .toolbar-btn:hover { background: var(--g-50); }

    .notif-list { display: flex; flex-direction: column; gap: 1px; background: var(--n-100); border-radius: 14px; overflow: hidden; }
    .notif-item {
      display: flex;
      gap: 12px;
      padding: 14px;
      background: #fff;
      cursor: pointer;
      min-height: 56px;
      align-items: flex-start;
    }
    .notif-item:active { background: var(--g-50); }
    .notif-item:hover { background: var(--g-50); }
    .notif-item.unread { background: var(--g-50); }
    .notif-icon-wrap {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--g-100);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .notif-icon-wrap .material-icons-outlined { font-size: 18px; color: var(--brand); }
    .notif-body { flex: 1; min-width: 0; }
    .notif-title {
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 700;
      color: var(--heading-color);
      display: block;
      margin-bottom: 2px;
    }
    .notif-text { font-size: 12px; color: var(--text-secondary); line-height: 1.4; margin: 0; }
    .notif-date { font-size: 11px; color: var(--text-dim); display: block; margin-top: 4px; }
    .unread-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--brand);
      flex-shrink: 0;
      margin-top: 8px;
    }

    /* === EVALUATIONS === */
    .rating-summary {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 14px;
      margin-bottom: 12px;
    }
    .rating-big {
      font-family: var(--font-display);
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--brand);
      line-height: 1;
    }
    .rating-stars .material-icons-outlined { font-size: 18px; color: var(--n-300); }
    .rating-stars .material-icons-outlined.filled { color: #f59e0b; }
    .rating-count { font-size: 13px; color: var(--text-dim); }

    .review-card {
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 10px;
    }
    .review-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .review-stars .material-icons-outlined { font-size: 16px; color: var(--n-300); }
    .review-stars .material-icons-outlined.filled { color: #f59e0b; }
    .review-date { font-size: 12px; color: var(--text-dim); }
    .review-text { font-size: 14px; color: var(--text-secondary); line-height: 1.5; margin: 0; }

    /* === SETTINGS === */
    .settings-section {
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .settings-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      color: var(--heading-color);
      margin-bottom: 16px;
    }
    .settings-title .material-icons-outlined { font-size: 20px; color: var(--brand); }
    .settings-hint { font-size: 12px; color: var(--text-dim); margin-bottom: 12px; }

    .form-field { margin-bottom: 14px; }
    .form-field label {
      display: block;
      font-family: var(--font-display);
      font-size: 12px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 6px;
    }
    .form-field input {
      width: 100%;
      padding: 12px 14px;
      border: 1.5px solid var(--n-200);
      border-radius: 12px;
      font-size: 16px;
      background: var(--g-50);
      min-height: 48px;
      transition: border-color 0.2s;
    }
    .form-field input:focus { outline: none; border-color: var(--brand); background: #fff; }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .btn-save {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      background: var(--brand);
      color: #fff;
      border: none;
      border-radius: 14px;
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      min-height: 52px;
      transition: all 0.15s;
    }
    .btn-save:active { background: var(--brand-dark); transform: scale(0.98); }
    .btn-save:hover { background: var(--brand-dark); }
    .btn-save:disabled { opacity: 0.5; }
    .btn-save .material-icons-outlined { font-size: 20px; }

    .success-msg {
      font-size: 13px;
      color: var(--brand);
      background: var(--g-50);
      padding: 10px 14px;
      border-radius: 10px;
      margin-bottom: 12px;
    }

    .btn-logout {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      background: #fff;
      color: #dc2626;
      border: 1.5px solid #fecaca;
      border-radius: 14px;
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      min-height: 52px;
    }
    .btn-logout:active { background: #fef2f2; }
    .btn-logout:hover { background: #fef2f2; }
    .btn-logout .material-icons-outlined { font-size: 20px; }

    /* === EMPTY STATE === */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px 24px;
      text-align: center;
    }
    .empty-state .material-icons-outlined { font-size: 3rem; color: var(--n-300); margin-bottom: 12px; }
    .empty-state h3 { font-family: var(--font-display); font-size: 1rem; color: var(--heading-color); margin-bottom: 4px; }
    .empty-state p { font-size: 13px; color: var(--text-secondary); }

    /* === UTILITY: show/hide === */
    .desktop-only { display: none; }
    .mobile-only { display: flex; }

    /* === DESKTOP SIDEBAR (hidden on mobile) === */
    .profile-sidebar { display: none; }
    .profile-main { display: contents; }

    /* === BOTTOM NAV (mobile) === */
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 200;
      background: #fff;
      border-top: 1px solid var(--n-100);
      display: flex;
      padding: 4px 0 env(safe-area-inset-bottom, 4px);
      box-shadow: 0 -2px 12px rgba(0,0,0,0.06);
    }
    .bottom-nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 4px 6px;
      border: none;
      background: none;
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 10px;
      font-weight: 600;
      color: var(--text-dim);
      position: relative;
      min-height: 52px;
      justify-content: center;
      transition: color 0.15s;
    }
    .bottom-nav-item .material-icons-outlined { font-size: 22px; }
    .bottom-nav-item.active { color: var(--brand); }
    .bottom-nav-item.active::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 24px;
      height: 3px;
      background: var(--brand);
      border-radius: 0 0 3px 3px;
    }
    .bottom-nav-badge {
      position: absolute;
      top: 4px;
      right: calc(50% - 18px);
      background: #ef4444;
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      min-width: 16px;
      height: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    /* === DESKTOP LAYOUT === */
    @media (min-width: 768px) {
      .desktop-only { display: flex; }
      .mobile-only { display: none !important; }

      .profile-page {
        display: grid;
        grid-template-columns: 280px 1fr;
        grid-template-rows: auto 1fr;
        min-height: 100dvh;
        padding-bottom: 0;
      }

      /* Header spans full width */
      .profile-header {
        grid-column: 1 / -1;
        padding: 24px 32px;
        gap: 20px;
      }
      .profile-avatar-wrap { width: 72px; height: 72px; }
      .profile-avatar { width: 72px; height: 72px; border-width: 3px; }
      .profile-avatar .avatar-initial { font-size: 28px; }
      .profile-avatar .material-icons-outlined { font-size: 30px; }
      .avatar-edit { width: 26px; height: 26px; }
      .avatar-edit .material-icons-outlined { font-size: 13px; }
      .profile-info h1 { font-size: 1.4rem; }
      .profile-role { font-size: 13px; }
      .profile-badge-item { font-size: 11px; padding: 3px 10px; }

      /* Sidebar */
      .profile-sidebar {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 20px 16px;
        border-right: 1px solid var(--n-100);
        background: #fff;
        position: sticky;
        top: 0;
        height: calc(100dvh - 120px);
        overflow-y: auto;
      }
      .sidebar-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border: none;
        background: none;
        border-radius: 10px;
        cursor: pointer;
        font-family: var(--font-display);
        font-size: 14px;
        font-weight: 600;
        color: var(--text-secondary);
        transition: all 0.15s;
        text-align: left;
        min-height: 44px;
      }
      .sidebar-item:hover { background: var(--g-50); color: var(--heading-color); }
      .sidebar-item.active {
        background: var(--brand-light);
        color: var(--brand);
      }
      .sidebar-item .material-icons-outlined { font-size: 20px; }
      .sidebar-badge {
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
      .sidebar-divider {
        height: 1px;
        background: var(--n-100);
        margin: 8px 0;
      }

      /* Main content */
      .profile-main {
        padding: 24px 32px 40px;
        max-width: 720px;
      }
      .profile-main .tab-content { min-height: auto; padding-top: 0; }

      /* Quick actions: grid instead of scroll */
      .quick-actions {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 10px;
        padding: 0 0 20px;
        overflow: visible;
      }

      /* Form two columns */
      .form-row { grid-template-columns: 1fr 1fr; }

      /* Hide mobile bottom nav */
      .bottom-nav { display: none; }

      /* Order grid */
      .order-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

      /* Notifications grid */
      .notif-list { max-width: 600px; }
    }

    @media (min-width: 1024px) {
      .profile-page { grid-template-columns: 300px 1fr; }
      .profile-main { max-width: 800px; }
      .order-list { grid-template-columns: 1fr; }
    }
  `]
})
export class ProfilComponent implements OnInit {
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;

  onglet: 'commandes' | 'parametres' | 'notifications' | 'evaluations' = 'commandes';
  commandes: Commande[] = [];
  notifications: Notification[] = [];
  evaluations: Evaluation[] = [];
  badges: Badge[] = [];
  editNom = '';
  editPrenom = '';
  editTelephone = '';
  editLocalite = '';
  editPseudo = '';
  message = '';
  pseudoMessage = '';
  enCours = false;
  pseudoEnCours = false;

  private cdr = inject(ChangeDetectorRef);

  constructor(
    public auth: AuthService,
    private router: Router,
    private utilisateurService: UtilisateurService,
    private commandeService: CommandeService,
    private notificationService: NotificationService,
    private evaluationService: EvaluationService,
    private uploadService: UploadService,
    private badgeService: BadgeService
  ) {}

  ngOnInit() {
    const u = this.auth.utilisateur();
    if (u?.type === 'ADMIN') {
      this.onglet = 'parametres';
    } else {
      this.chargerCommandes();
      this.chargerBadges();
    }
    if (u) {
      this.editNom = u.nom;
      this.editPrenom = u.prenom;
      this.editTelephone = u.telephone;
      this.editLocalite = u.localite;
      this.editPseudo = u.pseudoForum || '';
    }
    this.cdr.markForCheck();
  }

  chargerCommandes() {
    this.commandeService.getMesCommandes().subscribe(data => this.commandes = data);
  }

  chargerNotifications() {
    this.notificationService.getMesNotifications().subscribe(data => this.notifications = data);
  }

  chargerEvaluations() {
    const u = this.auth.utilisateur();
    if (u) {
      this.evaluationService.getByReceveur(u.id).subscribe(data => this.evaluations = data);
    }
  }

  chargerBadges() {
    this.badgeService.getMesBadges().subscribe(data => this.badges = data);
  }

  badgeStatutColor(statut: string): string {
    const map: Record<string, string> = { 'VALIDE': '#e8f5e9', 'EN_ATTENTE': '#fff3e0', 'REFUSE': '#ffebee' };
    return map[statut] || '#f5f5f5';
  }

  badgeStatutTextColor(statut: string): string {
    const map: Record<string, string> = { 'VALIDE': '#2e7d32', 'EN_ATTENTE': '#e65100', 'REFUSE': '#c62828' };
    return map[statut] || '#666';
  }

  badgeStatutLabel(statut: string): string {
    const map: Record<string, string> = { 'VALIDE': 'Valide', 'EN_ATTENTE': 'En attente', 'REFUSE': 'Refuse' };
    return map[statut] || statut;
  }

  get evalMoyenne(): number {
    if (!this.evaluations.length) return 0;
    const sum = this.evaluations.reduce((acc, e) => acc + e.note, 0);
    return sum / this.evaluations.length;
  }

  get nonLuesCount(): number {
    return this.notifications.filter(n => !n.estLue).length;
  }

  ongletChange(onglet: string) {
    this.onglet = onglet as any;
    if (onglet === 'notifications') this.chargerNotifications();
    if (onglet === 'evaluations') this.chargerEvaluations();
  }

  marquerLue(n: Notification) {
    if (!n.estLue) {
      this.notificationService.marquerLue(n.id).subscribe(() => {
        n.estLue = true;
      });
    }
    if (n.lien) {
      window.location.hash = n.lien;
    }
  }

  marquerToutLu() {
    this.notificationService.marquerToutLu().subscribe(() => {
      this.notifications.forEach(n => n.estLue = true);
    });
  }

  statutClass(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE':'attente','CONFIRMEE':'confirmee','EN_PREPARATION':'preparation','EN_COURS_LIVRAISON':'livraison','LIVREE':'livree','ANNULEE':'annulee' };
    return map[s] || '';
  }

  statutLabel(s: string): string {
    const map: Record<string,string> = { 'EN_ATTENTE':'En attente','CONFIRMEE':'Confirmee','EN_PREPARATION':'Preparation','EN_COURS_LIVRAISON':'Livraison','LIVREE':'Livree','ANNULEE':'Annulee' };
    return map[s] || s;
  }

  get isProducteur(): boolean {
    return this.auth.utilisateur()?.type === 'PRODUCTEUR';
  }

  get estTypeAdmin(): boolean {
    const type = this.auth.utilisateur()?.type;
    return !!type && ['ADMIN','SUPER_ADMIN','MODERATION_SUPPORT'].includes(type);
  }

  getRoleLabel(): string {
    const map: Record<string,string> = { 'PRODUCTEUR':'Producteur','ACHETEUR':'Acheteur','ADMIN':'Administrateur','LOGISTIQUE':'Logistique','AGENT_RELAIS':'Agent relais','MODERATION_FORUM':'Moderateur forum','ADMIN_TECHNIQUE':'Admin technique' };
    return map[this.auth.utilisateur()?.type || ''] || '';
  }

  getNotifIcon(type: string): string {
    const map: Record<string,string> = { 'COMMANDE':'shopping_bag','LIVRAISON':'local_shipping','EVALUATION':'star','MESSAGERIE':'chat','MODERATION':'gavel' };
    return map[type] || 'notifications';
  }

  deconnexion() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  photoEnCours = false;
  photoErreur = false;

  triggerPhotoUpload() {
    if (this.photoInput) {
      this.photoInput.nativeElement.click();
    }
  }

  onPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const file = input.files[0];
    this.photoEnCours = true;
    this.photoErreur = false;

    this.uploadService.upload(file).subscribe({
      next: (res) => {
        this.utilisateurService.updateMe({ photoProfil: res.url }).subscribe({
          next: (u) => {
            this.auth.utilisateur.set(u);
            localStorage.setItem('smartagri_user', JSON.stringify(u));
            this.photoEnCours = false;
          },
          error: (err) => {
            console.error('Erreur updateMe:', err);
            this.photoEnCours = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur upload:', err);
        this.photoEnCours = false;
      }
    });
    input.value = '';
  }

  sauvegarder() {
    if (this.enCours) return;
    this.enCours = true;
    this.message = '';
    this.utilisateurService.updateMe({
      nom: this.editNom, prenom: this.editPrenom,
      telephone: this.editTelephone, localite: this.editLocalite
    }).subscribe({
      next: () => { this.message = 'Profil mis a jour'; this.enCours = false; },
      error: () => { this.message = 'Erreur'; this.enCours = false; }
    });
  }

  sauvegarderPseudo() {
    if (this.pseudoEnCours) return;
    this.pseudoEnCours = true;
    this.pseudoMessage = '';
    this.utilisateurService.updatePseudo({ pseudo: this.editPseudo }).subscribe({
      next: (u) => {
        this.pseudoMessage = 'Pseudo forum mis a jour';
        this.auth.utilisateur.set(u);
        this.editPseudo = u.pseudoForum || '';
        this.pseudoEnCours = false;
      },
      error: (err) => {
        this.pseudoMessage = 'Erreur : ' + (err.error?.error || 'pseudo invalide');
        this.pseudoEnCours = false;
      }
    });
  }
}
