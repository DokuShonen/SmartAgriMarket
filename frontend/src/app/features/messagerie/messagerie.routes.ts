import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/liste-conversations.component').then(m => m.ListeConversationsComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/conversation-detail.component').then(m => m.ConversationDetailComponent)
  }
];
