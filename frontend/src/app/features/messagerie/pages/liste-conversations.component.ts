import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MessagerieService } from '../../../core/services/messagerie.service';

@Component({
  selector: 'app-liste-conversations',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink],
  template: `
    <div class="msg-container">
      <h2>Messagerie</h2>
      <div *ngIf="conversations.length; else empty">
        <a *ngFor="let c of conversations" [routerLink]="'/messagerie/' + c.id" class="conv-card">
          <div class="conv-avatar">{{ c.participants[0]?.charAt(0) || '?' }}</div>
          <div class="conv-info">
            <p class="conv-name">{{ c.participants.join(', ') }}</p>
            <p class="conv-preview">{{ c.messages?.[c.messages.length - 1]?.contenuFiltre || c.messages?.[c.messages.length - 1]?.contenu || 'Aucun message' }}</p>
          </div>
          <span class="conv-date">{{ c.dateDebut | date:'dd/MM' }}</span>
        </a>
      </div>
      <ng-template #empty><div class="empty">Aucune conversation.</div></ng-template>
    </div>
  `,
  styles: [`
    .msg-container { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem; }
    h2 { font-size: 1.4rem; margin-bottom: 1rem; }
    .conv-card { display: flex; align-items: center; gap: 0.75rem; background: #fff; border: 1px solid #e8e8e8; border-radius: 10px; padding: 0.85rem; margin-bottom: 0.5rem; text-decoration: none; color: inherit; transition: background 0.2s; }
    .conv-card:hover { background: #f9f9f9; }
    .conv-avatar { width: 40px; height: 40px; background: #e8f5e9; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #1a5c2a; flex-shrink: 0; }
    .conv-info { flex: 1; min-width: 0; }
    .conv-name { font-weight: 600; font-size: 0.9rem; }
    .conv-preview { color: #888; font-size: 0.8rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .conv-date { font-size: 0.75rem; color: #aaa; flex-shrink: 0; }
    .empty { text-align: center; padding: 3rem; color: #888; }
  `]
})
export class ListeConversationsComponent implements OnInit {
  conversations: any[] = [];

  constructor(private messagerieService: MessagerieService) {}

  ngOnInit() {
    this.messagerieService.getConversations().subscribe(data => this.conversations = data);
  }
}
