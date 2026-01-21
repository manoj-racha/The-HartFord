import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import {AuthService} from '../services/auth';


export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const currentUser = authService.currentUserValue;

  if (currentUser && currentUser.role === 'admin') {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
