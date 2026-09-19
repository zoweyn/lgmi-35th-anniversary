import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private supabaseService: SupabaseService
  ) {}

  /**
   * Login using Supabase Auth
   */
  async login(email: string, password: string) {
    const { data, error } =
      await this.supabaseService.client.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Check if the currently logged-in user
   * is registered as an LGMI administrator.
   */
  async isAdmin(): Promise<boolean> {
    const { data, error } =
      await this.supabaseService.client.rpc('is_admin');

    if (error) {
      console.error('Admin verification error:', error);
      return false;
    }

    return data === true;
  }

  /**
   * Get the current Supabase session.
   */
  async getSession() {
    const { data, error } =
      await this.supabaseService.client.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return null;
    }

    return data.session;
  }

  /**
   * Logout the current user.
   */
  async logout() {
    const { error } =
      await this.supabaseService.client.auth.signOut();

    if (error) {
      throw error;
    }
  }
}