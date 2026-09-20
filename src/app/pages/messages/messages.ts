import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SupabaseService } from '../../core/supabase';

interface PublicMessage {
  id: string;
  name: string | null;
  message: string;
  is_anonymous: boolean;
  created_at: string;
}

@Component({
  selector: 'app-messages',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './messages.html',
  styleUrl: './messages.scss',
})
export class Messages {
  private readonly supabaseService = inject(SupabaseService);

  name = '';
  message = '';
  isAnonymous = true;

  isSubmitting = signal(false);
  isLoadingMessages = signal(true);

  successMessage = signal('');
  errorMessage = signal('');

  publicMessages = signal<PublicMessage[]>([]);

  async ngOnInit() {
    await this.loadPublicMessages();
  }

  async loadPublicMessages() {
    this.isLoadingMessages.set(true);

    try {
      const { data, error } = await this.supabaseService.client
        .from('church_messages')
        .select('id, name, message, is_anonymous, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      this.publicMessages.set(data ?? []);
    } catch (error) {
      console.error('Unable to load church messages:', error);
    } finally {
      this.isLoadingMessages.set(false);
    }
  }

  async submitMessage() {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.message.trim()) {
      this.errorMessage.set('Please write a message before submitting.');
      return;
    }

    if (this.message.trim().length < 5) {
      this.errorMessage.set('Your message is too short.');
      return;
    }

    this.isSubmitting.set(true);

    try {
      const { error } = await this.supabaseService.client.from('church_messages').insert({
        name: this.name.trim() || null,

        message: this.message.trim(),

        is_anonymous: this.isAnonymous,

        status: 'approved',
      });

      if (error) {
        throw error;
      }

      this.name = '';
      this.message = '';
      this.isAnonymous = true;

      this.successMessage.set(
        'Thank you! Your message has been shared successfully.',
      );
    } catch (error: any) {
      console.error('Unable to submit message:', error);

      this.errorMessage.set(error?.message ?? 'Unable to submit your message. Please try again.');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  done() {
    window.location.reload();
  }

  
  displayName(item: PublicMessage) {
    if (item.is_anonymous) {
      return 'Anonymous';
    }

    return item.name?.trim() || 'Anonymous';
  }

  formatDate(date: string) {
    return new Intl.DateTimeFormat('en-PH', {
      dateStyle: 'medium',
    }).format(new Date(date));
  }
}
