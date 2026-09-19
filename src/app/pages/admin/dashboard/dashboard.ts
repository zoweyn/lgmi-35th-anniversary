import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth';
import { SupabaseService } from '../../../core/supabase';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly authService = inject(AuthService);
  private readonly supabaseService = inject(SupabaseService);
  private readonly router = inject(Router);

  isLoggingOut = signal(false);
  isLoading = signal(true);

  memoryCount = signal(0);
  photoCount = signal(0);
  messageCount = signal(0);
  pendingCount = signal(0);

  async ngOnInit() {
    await this.loadStatistics();
  }

  async loadStatistics() {
    this.isLoading.set(true);

    try {
      const supabase = this.supabaseService.client;

      const { count: memories } = await supabase.from('memories').select('*', {
        count: 'exact',
        head: true,
      });

      const { count: photos } = await supabase.from('photos').select('*', {
        count: 'exact',
        head: true,
      });

      const { count: messages } = await supabase.from('church_messages').select('*', {
        count: 'exact',
        head: true,
      });

      const { count: pendingMemories } = await supabase
        .from('memories')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'pending');

      const { count: pendingPhotos } = await supabase
        .from('photos')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'pending');

      const { count: pendingMessages } = await supabase
        .from('church_messages')
        .select('*', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'pending');

      this.memoryCount.set(memories ?? 0);

      this.photoCount.set(photos ?? 0);

      this.messageCount.set(messages ?? 0);

      this.pendingCount.set((pendingMemories ?? 0) + (pendingPhotos ?? 0) + (pendingMessages ?? 0));
    } catch (error) {
      console.error('Unable to load dashboard statistics:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async logout() {
    this.isLoggingOut.set(true);

    try {
      await this.authService.logout();

      await this.router.navigate(['/admin']);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.isLoggingOut.set(false);
    }
  }
}
