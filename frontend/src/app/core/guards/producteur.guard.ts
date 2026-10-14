import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

const ALLOWED_TYPES = ['PRODUCTEUR', 'ADMIN', 'SUPER_ADMIN', 'MODERATION_SUPPORT'];

export const producteurGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const u = auth.utilisateur();
  if (u && ALLOWED_TYPES.includes(u.type)) return true;
  return router.parseUrl('/');
};
