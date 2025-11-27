import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard pour protéger les routes nécessitant une authentification
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;  // L'utilisateur peut accéder à la route
  } else {
    // Rediriger vers la page de login
    router.navigate(['/login']);
    return false;  // Bloquer l'accès
  }
};