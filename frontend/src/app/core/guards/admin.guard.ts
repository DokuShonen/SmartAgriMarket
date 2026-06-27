import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const u = auth.utilisateur();
  if (u && u.type === 'ADMIN') return true;
  return router.parseUrl('/');
};
