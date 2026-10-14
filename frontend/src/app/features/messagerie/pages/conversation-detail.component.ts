import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild, inject } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { MessagerieService } from '../../../core/services/messagerie.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-conversation-detail',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink, FormsModule],
  template: `
    <div class="chat-page" *ngIf="conv; else loading">
      <!-- Chat header -->
      <div class="chat-topbar">
        <a routerLink="/messagerie" class="back-btn">
          <span class="material-icons-outlined">arrow_back</span>
        </a>
        <div class="chat-contact">
          <div class="contact-avatar" [style.backgroundImage]="getPhoto() ? 'url(' + getPhoto() + ')' : ''" [class.has-photo]="!!getPhoto()"><span *ngIf="!getPhoto()">{{ getInitial() }}</span></div>
          <div class="contact-info">
            <span class="contact-name">{{ getOtherName() }}</span>
          </div>
        </div>
        <div class="topbar-spacer"></div>
        <div class="menu-wrap">
          <button class="menu-btn" (click)="menuOpen = !menuOpen">
            <span class="material-icons-outlined">more_vert</span>
          </button>
          <div class="menu-dropdown" *ngIf="menuOpen">
            <button class="menu-item" (click)="signalerUtilisateur()">
              <span class="material-icons-outlined">flag</span> Signaler l'utilisateur
            </button>
          </div>
        </div>
      </div>

      <!-- Messages -->
      <div class="messages-area" #messagesContainer>
        <div *ngIf="!(conv.messages?.length)" class="no-messages">
          <span class="material-icons-outlined">chat_bubble_outline</span>
          <p>Envoyez le premier message</p>
        </div>
        <div *ngFor="let m of conv.messages || []; let last = last" class="msg-row" [class.mine]="m.expediteurId === userId">
          <div *ngIf="m.expediteurId !== userId" class="msg-avatar" [style.backgroundImage]="m.expediteurPhoto ? 'url(' + m.expediteurPhoto + ')' : ''" [class.has-photo]="!!m.expediteurPhoto"><span *ngIf="!m.expediteurPhoto">{{ getOtherName().charAt(0) }}</span></div>
          <div class="msg-bubble">
            <p class="msg-text">{{ m.contenuFiltre || m.contenu }}</p>
            <div class="msg-bottom">
              <span class="msg-time">{{ formatTime(m.dateEnvoi) }}</span>
              <button *ngIf="m.expediteurId !== userId" class="msg-report" (click)="signalerMessage(m)" [disabled]="signalementEnCours">Signaler</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Compose bar -->
      <div class="compose-bar">
        <div class="compose-input">
          <input
            type="text"
            [(ngModel)]="nouveauMessage"
            placeholder="Votre message..."
            (keyup.enter)="envoyer()"
            #msgInput
          />
        </div>
        <button class="send-btn" (click)="envoyer()" [disabled]="!nouveauMessage.trim()">
          <span class="material-icons-outlined">send</span>
        </button>
      </div>

      <!-- Signalement feedback -->
      <div class="signalement-toast" *ngIf="signalementMessage" (click)="signalementMessage = ''">
        <span class="material-icons-outlined">{{ signalementSuccess ? 'check_circle' : 'error' }}</span>
        {{ signalementMessage }}
      </div>
    </div>

    <ng-template #loading>
      <div class="chat-page">
        <div class="chat-topbar">
          <a routerLink="/messagerie" class="back-btn">
            <span class="material-icons-outlined">arrow_back</span>
          </a>
        </div>
        <div class="loading-chat">
          <div class="skel skel-bubble"></div>
          <div class="skel skel-bubble right"></div>
          <div class="skel skel-bubble"></div>
        </div>
      </div>
    </ng-template>
  `,
  styles: [`
    .chat-page {
      display: flex;
      flex-direction: column;
      height: calc(100dvh - 48px);
      max-width: 640px;
      margin: 0 auto;
      background: var(--g-50);
    }

    /* === TOPBAR === */
    .chat-topbar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: #fff;
      border-bottom: 1px solid var(--n-100);
      flex-shrink: 0;
    }

    .back-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 50%;
      color: var(--heading-color);
      text-decoration: none;
      flex-shrink: 0;
    }
    .back-btn:active { background: var(--g-50); }
    .back-btn .material-icons-outlined { font-size: 22px; }

    .chat-contact {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .contact-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--brand-light);
      background-size: cover;
      background-position: center;
      color: var(--brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .contact-avatar.has-photo { background-size: cover; background-position: center; }

    .contact-name {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      color: var(--heading-color);
    }

    /* === MESSAGES === */
    .messages-area {
      flex: 1;
      overflow-y: auto;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      -webkit-overflow-scrolling: touch;
    }

    .no-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-dim);
    }
    .no-messages .material-icons-outlined { font-size: 3rem; color: var(--n-300); margin-bottom: 8px; }
    .no-messages p { font-size: 13px; }

    .msg-row {
      display: flex;
      max-width: 80%;
    }
    .msg-row.mine { align-self: flex-end; }
    .msg-row:not(.mine) { gap: 6px; align-items: flex-end; }

    .msg-avatar {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--g-100);
      background-size: cover;
      background-position: center;
      color: var(--text-dim);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-bottom: 2px;
    }
    .msg-avatar.has-photo { background-size: cover; background-position: center; }

    .msg-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .msg-row.mine .msg-bubble {
      background: var(--brand);
      color: #fff;
      border-bottom-left-radius: 16px;
      border-bottom-right-radius: 4px;
    }

    .msg-text {
      font-size: 14px;
      line-height: 1.4;
      word-wrap: break-word;
      margin: 0;
    }

    .msg-time {
      display: block;
      font-size: 10px;
      color: var(--text-dim);
      text-align: right;
      margin-top: 3px;
    }
    .msg-row.mine .msg-time { color: rgba(255, 255, 255, 0.6); }

    /* === COMPOSE === */
    .compose-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      background: #fff;
      border-top: 1px solid var(--n-100);
      flex-shrink: 0;
      padding-bottom: calc(10px + env(safe-area-inset-bottom, 0px));
    }

    .compose-input {
      flex: 1;
    }
    .compose-input input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--n-200);
      border-radius: 24px;
      font-size: 14px;
      background: var(--g-50);
      outline: none;
      transition: border-color 0.15s;
    }
    .compose-input input:focus { border-color: var(--brand); background: #fff; }

    .send-btn {
      width: 44px;
      height: 44px;
      border: none;
      background: var(--brand);
      color: #fff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .send-btn:active { background: var(--brand-dark); transform: scale(0.92); }
    .send-btn:disabled { background: var(--n-300); }
    .send-btn .material-icons-outlined { font-size: 20px; }

    /* === LOADING === */
    .loading-chat {
      flex: 1;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .skel {
      height: 40px;
      width: 60%;
      background: linear-gradient(90deg, var(--n-100) 25%, var(--n-200) 50%, var(--n-100) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 16px;
    }
    .skel.right { align-self: flex-end; width: 50%; background: var(--g-100); }
    @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

    /* === TOPBAR MENU === */
    .topbar-spacer { flex: 1; }
    .menu-wrap { position: relative; }
    .menu-btn {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 50%;
      color: var(--heading-color);
      cursor: pointer;
    }
    .menu-btn:active { background: var(--g-50); }
    .menu-btn .material-icons-outlined { font-size: 22px; }
    .menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: #fff;
      border: 1px solid var(--n-100);
      border-radius: 10px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
      min-width: 200px;
      z-index: 10;
      overflow: hidden;
    }
    .menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 12px 14px;
      border: none;
      background: none;
      cursor: pointer;
      font-family: var(--font-display);
      font-size: 14px;
      color: var(--heading-color);
      text-align: left;
    }
    .menu-item:active { background: var(--g-50); }
    .menu-item .material-icons-outlined { font-size: 18px; color: var(--text-dim); }

    /* === MSG REPORT === */
    .msg-bottom {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 3px;
    }
    .msg-report {
      border: none;
      background: none;
      color: var(--text-dim);
      font-size: 10px;
      cursor: pointer;
      padding: 0;
      font-family: var(--font-display);
    }
    .msg-report:active { color: #dc2626; }
    .msg-report:disabled { opacity: 0.4; }

    /* === SIGNALEMENT TOAST === */
    .signalement-toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: var(--heading-color);
      color: #fff;
      border-radius: 10px;
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 600;
      z-index: 100;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      max-width: 90%;
      text-align: center;
    }
    .signalement-toast .material-icons-outlined { font-size: 18px; }

    @media (min-width: 769px) {
      .chat-page { border: 1px solid var(--n-100); border-radius: 12px; margin: 2rem auto; height: calc(100dvh - 120px); }
    }
  `]
})
export class ConversationDetailComponent implements OnInit, AfterViewChecked {
  conv: any;
  nouveauMessage = '';
  userId = '';
  private shouldScroll = false;
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  menuOpen = false;
  signalementEnCours = false;
  signalementMessage = '';
  signalementSuccess = false;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private messagerieService: MessagerieService,
    private auth: AuthService
  ) {
    this.userId = this.auth.utilisateur()?.id || '';
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.messagerieService.getConversation(id).subscribe({
      next: data => { this.conv = data; this.shouldScroll = true; },
      error: () => this.conv = null
    });
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch (e) {}
  }

  getInitial(): string {
    const name = this.getOtherName();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getOtherName(): string {
    return this.conv?.participants?.join(', ') || 'Utilisateur';
  }

  getPhoto(): string | null {
    return this.conv?.participantsPhotos?.length ? this.conv.participantsPhotos[0] : null;
  }

  formatTime(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  envoyer() {
    if (!this.nouveauMessage.trim() || !this.conv) return;
    const msg = this.nouveauMessage;
    this.nouveauMessage = '';

    this.messagerieService.sendMessage(msg, this.conv.id).subscribe({
      next: () => {
        this.messagerieService.getConversation(this.conv.id).subscribe(data => {
          this.conv = data;
          this.shouldScroll = true;
        });
      }
    });
  }

  signalerMessage(m: any) {
    const motif = window.prompt('Motif du signalement :');
    if (!motif?.trim()) return;
    this.signalementEnCours = true;
    this.signalementMessage = '';
    this.http.post(`${this.apiUrl}/signalements`, {
      typeCible: 'MESSAGE',
      cibleId: m.id,
      motif: motif.trim()
    }).subscribe({
      next: () => {
        this.signalementSuccess = true;
        this.signalementMessage = 'Message signalé. Merci.';
        this.signalementEnCours = false;
        setTimeout(() => this.signalementMessage = '', 4000);
      },
      error: () => {
        this.signalementSuccess = false;
        this.signalementMessage = 'Erreur lors du signalement.';
        this.signalementEnCours = false;
        setTimeout(() => this.signalementMessage = '', 4000);
      }
    });
  }

  signalerUtilisateur() {
    this.menuOpen = false;
    const otherId = this.getOtherUserId();
    if (!otherId) return;
    const motif = window.prompt('Motif du signalement :');
    if (!motif?.trim()) return;
    this.signalementEnCours = true;
    this.signalementMessage = '';
    this.http.post(`${this.apiUrl}/signalements`, {
      typeCible: 'UTILISATEUR',
      cibleId: otherId,
      motif: motif.trim()
    }).subscribe({
      next: () => {
        this.signalementSuccess = true;
        this.signalementMessage = 'Utilisateur signalé. Merci.';
        this.signalementEnCours = false;
        setTimeout(() => this.signalementMessage = '', 4000);
      },
      error: () => {
        this.signalementSuccess = false;
        this.signalementMessage = 'Erreur lors du signalement.';
        this.signalementEnCours = false;
        setTimeout(() => this.signalementMessage = '', 4000);
      }
    });
  }

  private getOtherUserId(): string | null {
    if (!this.conv?.messages?.length) return null;
    const otherMsg = this.conv.messages.find((m: any) => m.expediteurId !== this.userId);
    return otherMsg?.expediteurId || null;
  }
}
