import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/dashboard/agent-relais-dashboard.component').then(m => m.AgentRelaisDashboardComponent) }
];
