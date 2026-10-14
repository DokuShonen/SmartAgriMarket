import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessagerieService } from '../../../core/services/messagerie.service';

@Component({
  selector: 'app-liste-conversations',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink],
  template: `
    <div class="chat-list-page">
      <div class="chat-header">
        <h1>Messages</h1>
      </div>

      <div class="conv-list" *ngIf="conversations.length; else empty">
        <a *ngFor="let c of conversations" [routerLink]="'/messagerie/' + c.id" class="conv-row">
          <div class="conv-avatar" [style.backgroundImage]="getPhoto(c) ? 'url(' + getPhoto(c) + ')' : ''" [class.has-photo]="!!getPhoto(c)">
            <span *ngIf="!getPhoto(c)">{{ getInitial(c) }}</span>
          </div>
          <div class="conv-body">
            <div class="conv-top">
              <span class="conv-name">{{ getOtherName(c) }}</span>
              <span class="conv-time">{{ getLastDate(c) }}</span>
            </div>
            <p class="conv-preview">{{ getLastMessage(c) }}</p>
          </div>
        </a>
      </div>

      <ng-template #empty>
        <div class="empty-chat">
          <span class="material-icons-outlined">chat_bubble_outline</span>
          <h3>Aucune conversation</h3>
          <p>Contactez un vendeur depuis une fiche produit</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .chat-list-page {
      max-width: 640px;
      margin: 0 auto;
      min-height: calc(100dvh - 48px);
      background: #fff;
    }

    .chat-header {
      padding: 16px;
      border-bottom: 1px solid var(--n-100);
    }
    .chat-header h1 {
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--heading-color);
    }

    .conv-list {
      display: flex;
      flex-direction: column;
    }

    .conv-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-bottom: 1px solid var(--n-100);
      text-decoration: none;
      color: inherit;
      transition: background 0.1s;
    }
    .conv-row:active { background: var(--g-50); }
    .conv-row:hover { background: var(--g-50); }

    .conv-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: var(--brand-light);
      background-size: cover;
      background-position: center;
      color: var(--brand);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }
    .conv-avatar.has-photo { background-size: cover; background-position: center; }

    .conv-body {
      flex: 1;
      min-width: 0;
    }

    .conv-top {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 3px;
    }

    .conv-name {
      font-family: var(--font-display);
      font-size: 15px;
      font-weight: 700;
      color: var(--heading-color);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .conv-time {
      font-size: 11px;
      color: var(--text-dim);
      flex-shrink: 0;
      margin-left: 8px;
    }

    .conv-preview {
      font-size: 13px;
      color: var(--text-secondary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 0;
    }

    .empty-chat {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      text-align: center;
    }
    .empty-chat .material-icons-outlined {
      font-size: 3rem;
      color: var(--n-300);
      margin-bottom: 12px;
    }
    .empty-chat h3 {
      font-family: var(--font-display);
      font-size: 1rem;
      color: var(--heading-color);
      margin-bottom: 4px;
    }
    .empty-chat p {
      font-size: 13px;
      color: var(--text-secondary);
    }

    @media (min-width: 769px) {
      .chat-list-page { border: 1px solid var(--n-100); border-radius: 12px; margin: 2rem auto; max-width: 640px; }
    }
  `]
})
export class ListeConversationsComponent implements OnInit {
  conversations: any[] = [];

  constructor(private messagerieService: MessagerieService) {}

  ngOnInit() {
    this.messagerieService.getConversations().subscribe(data => this.conversations = data);
  }

  getInitial(c: any): string {
    const name = this.getOtherName(c);
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getOtherName(c: any): string {
    return c.participants?.join(', ') || 'Utilisateur';
  }

  getPhoto(c: any): string | null {
    return c.participantsPhotos?.length ? c.participantsPhotos[0] : null;
  }

  getLastMessage(c: any): string {
    const msgs = c.messages;
    if (!msgs || !msgs.length) return 'Aucun message';
    const last = msgs[msgs.length - 1];
    return last.contenuFiltre || last.contenu || 'Aucun message';
  }

  getLastDate(c: any): string {
    const msgs = c.messages;
    if (!msgs || !msgs.length) return '';
    const last = msgs[msgs.length - 1];
    if (!last.dateEnvoi) return '';
    const d = new Date(last.dateEnvoi);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }
}
