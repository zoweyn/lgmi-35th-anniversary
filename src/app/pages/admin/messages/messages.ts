import {
  Component,
  inject,
  signal
} from '@angular/core';

import {
  SupabaseService
} from '../../../core/supabase';

interface ChurchMessage {
  id: string;
  name: string | null;
  message: string;
  is_anonymous: boolean;
  status:
    | 'pending'
    | 'approved'
    | 'rejected';
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-admin-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.scss'
})
export class AdminMessages {

  private readonly supabaseService =
    inject(SupabaseService);

  messages =
    signal<ChurchMessage[]>([]);

  isLoading = signal(true);

  isUpdating =
    signal<string | null>(null);

  errorMessage = signal('');

  successMessage = signal('');

  selectedFilter =
    signal<
      'all' |
      'pending' |
      'approved' |
      'rejected'
    >('all');


  async ngOnInit() {
    await this.loadMessages();
  }


  async loadMessages() {

    this.isLoading.set(true);

    this.errorMessage.set('');

    try {

      const { data, error } =
        await this.supabaseService.client
          .from('church_messages')
          .select('*')
          .order(
            'created_at',
            {
              ascending: false
            }
          );

      if (error) {
        throw error;
      }

      this.messages.set(
        data ?? []
      );

    } catch (error: any) {

      console.error(
        'Unable to load church messages:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to load messages.'
      );

    } finally {

      this.isLoading.set(false);

    }
  }


  setFilter(
    filter:
      | 'all'
      | 'pending'
      | 'approved'
      | 'rejected'
  ) {

    this.selectedFilter.set(
      filter
    );

  }


  filteredMessages() {

    const filter =
      this.selectedFilter();

    if (filter === 'all') {
      return this.messages();
    }

    return this.messages()
      .filter(
        message =>
          message.status === filter
      );
  }


  getCount(
    status:
      | 'all'
      | 'pending'
      | 'approved'
      | 'rejected'
  ) {

    if (status === 'all') {
      return this.messages().length;
    }

    return this.messages()
      .filter(
        message =>
          message.status === status
      )
      .length;
  }


  async updateStatus(
    id: string,
    status:
      | 'approved'
      | 'rejected'
  ) {

    this.isUpdating.set(id);

    this.errorMessage.set('');

    this.successMessage.set('');

    try {

      const { error } =
        await this.supabaseService.client
          .from('church_messages')
          .update({
            status,

            updated_at:
              new Date().toISOString()
          })
          .eq('id', id);

      if (error) {
        throw error;
      }

      this.messages.update(
        messages =>
          messages.map(
            message =>
              message.id === id
                ? {
                    ...message,
                    status
                  }
                : message
          )
      );

      this.successMessage.set(
        status === 'approved'
          ? 'Message approved successfully.'
          : 'Message rejected successfully.'
      );

    } catch (error: any) {

      console.error(
        'Unable to update message:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to update message.'
      );

    } finally {

      this.isUpdating.set(null);

    }
  }


  async deleteMessage(
    id: string
  ) {

    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this message?'
      );

    if (!confirmed) {
      return;
    }

    this.isUpdating.set(id);

    this.errorMessage.set('');

    this.successMessage.set('');

    try {

      const { error } =
        await this.supabaseService.client
          .from('church_messages')
          .delete()
          .eq('id', id);

      if (error) {
        throw error;
      }

      this.messages.update(
        messages =>
          messages.filter(
            message =>
              message.id !== id
          )
      );

      this.successMessage.set(
        'Message deleted successfully.'
      );

    } catch (error: any) {

      console.error(
        'Unable to delete message:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to delete message.'
      );

    } finally {

      this.isUpdating.set(null);

    }
  }


  displayName(
    message: ChurchMessage
  ) {

    if (message.is_anonymous) {
      return 'Anonymous';
    }

    return (
      message.name?.trim() ||
      'Anonymous'
    );
  }


  formatDate(date: string) {

    return new Intl.DateTimeFormat(
      'en-PH',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(
      new Date(date)
    );

  }

}