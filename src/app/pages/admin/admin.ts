import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth';
@Component({
  selector: 'app-admin',
  imports: [FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  email = '';
  password = '';

  isLoading = signal(false);
  errorMessage = signal('');

  async login() {

    this.errorMessage.set('');

    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.isLoading.set(true);

    try {

      // Login through Supabase Auth
      await this.authService.login(
        this.email.trim(),
        this.password
      );

      // Check if the authenticated user is an LGMI admin
      const isAdmin = await this.authService.isAdmin();

      if (!isAdmin) {

        await this.authService.logout();

        this.errorMessage.set(
          'Access denied. This account is not registered as an administrator.'
        );

        return;
      }

      // Successful admin login
      await this.router.navigate(['/admin/dashboard']);

    } catch (error: any) {

      console.error('Login error:', error);

      if (error?.message) {
        this.errorMessage.set(error.message);
      } else {
        this.errorMessage.set(
          'Unable to login. Please check your credentials and try again.'
        );
      }

    } finally {
      this.isLoading.set(false);
    }
  }
}