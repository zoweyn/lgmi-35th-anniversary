import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const adminGuard: CanActivateFn = async () => {

  const authService = inject(AuthService);
  const router = inject(Router);

  try {

    // Check if a Supabase session exists
    const session = await authService.getSession();

    if (!session) {
      return router.createUrlTree(['/admin']);
    }

    // Check if the logged-in user is an LGMI administrator
    const isAdmin = await authService.isAdmin();

    if (!isAdmin) {

      await authService.logout();

      return router.createUrlTree(['/admin']);
    }

    return true;

  } catch (error) {

    console.error('Admin guard error:', error);

    return router.createUrlTree(['/admin']);
  }
};
