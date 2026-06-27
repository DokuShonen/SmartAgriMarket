import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MessagerieService } from '../../../core/services/messagerie.service';

@Component({
  selector: 'app-conversation-detail',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, RouterLink, FormsModule],
  template: `
    <div class="conv-detail" *ngIf="conv">
      <a routerLink="/messagerie" class="back-link">← Toutes les conversations</a>
      <h3>{{ conv.participants.join(', ') }}</h3>

      <div class="messages">
        <div *ngFor="let m of conv.messages" class="msg" [class.mine]="m.expediteurId === 'me'">
          <div class="msg-bubble">
            <p>{{ m.contenuFiltre || m.contenu }}</p>
            <span class="msg-time">{{ m.dateEnvoi | date:'dd/MM HH:mm' }}</span>
          </div>
        </div>
      </div>

      <div class="compose">
        <textarea [(ngModel)]="nouveauMessage" rows="2" placeholder="Votre message..."></textarea>
        <button (click)="envoyer()" [disabled]="!nouveauMessage.trim()">Envoyer</button>
      </div>
    </div>
  `,
  styles: [`
    .conv-detail { max-width: 640px; margin: 0 auto; padding: 1.5rem 1rem; }
    .back-link { color: #1a5c2a; text-decoration: none; font-size: 0.9rem; }
    h3 { margin: 0.5rem 0 1rem; }
    .messages { background: #fff; border: 1px solid #e0e0e0; border-radius: 10px; padding: 1rem; height: 400px; overflow-y: auto; margin-bottom: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .msg { display: flex; }
    .msg.mine { justify-content: flex-end; }
    .msg-bubble { max-width: 75%; padding: 0.6rem 0.8rem; border-radius: 10px; background: #e8f5e9; font-size: 0.9rem; }
    .msg.mine .msg-bubble { background: #1a5c2a; color: #fff; }
    .msg-time { display: block; font-size: 0.7rem; color: #888; margin-top: 0.2rem; text-align: right; }
    .msg.mine .msg-time { color: #c8e6c9; }
    .compose { display: flex; gap: 0.5rem; }
    .compose textarea { flex: 1; padding: 0.6rem; border: 1px solid #ccc; border-radius: 8px; font-size: 0.9rem; resize: vertical; font-family: inherit; }
    .compose button { padding: 0.6rem 1.2rem; background: #1a5c2a; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
    .compose button:disabled { opacity: 0.5; }
  `]
})
export class ConversationDetailComponent implements OnInit {
  conv: any;
  nouveauMessage = '';

  constructor(
    private route: ActivatedRoute,
    private messagerieService: MessagerieService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.messagerieService.getConversations().subscribe(data => {
      this.conv = data.find((c: any) => c.id === id);
    });
  }

  envoyer() {
    if (!this.nouveauMessage.trim()) return;
    this.messagerieService.sendMessage(this.nouveauMessage).subscribe(() => {
      this.nouveauMessage = '';
    });
  }
}
