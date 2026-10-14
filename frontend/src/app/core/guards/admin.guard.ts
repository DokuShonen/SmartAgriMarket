import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const ADMIN_TYPES = ['ADMIN', 'SUPER_ADMIN', 'MODERATION_SUPPORT'];

export const adminGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const u = auth.utilisateur();
  if (u && ADMIN_TYPES.includes(u.type)) return true;
  return router.parseUrl('/');
};
