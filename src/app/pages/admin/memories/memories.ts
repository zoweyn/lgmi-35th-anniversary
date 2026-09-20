import {
  Component,
  inject,
  signal
} from '@angular/core';

import { SupabaseService } from '../../../core/supabase';

interface Memory {
  id: string;
  name: string | null;
  message: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-admin-memories',
  imports: [],
  templateUrl: './memories.html',
  styleUrl: './memories.scss'
})
export class AdminMemories {

  private readonly supabaseService =
    inject(SupabaseService);

  memories =
    signal<Memory[]>([]);

  isLoading =
    signal(true);

  isDeleting =
    signal<string | null>(null);

  errorMessage =
    signal('');

  successMessage =
    signal('');


  async ngOnInit() {
    await this.loadMemories();
  }


  async loadMemories() {

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {

      const { data, error } =
        await this.supabaseService.client
          .from('memories')
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

      this.memories.set(
        data ?? []
      );

    } catch (error: any) {

      console.error(
        'Unable to load memories:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to load memories.'
      );

    } finally {

      this.isLoading.set(false);

    }
  }


  async deleteMemory(id: string) {

    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this memory?'
      );

    if (!confirmed) {
      return;
    }

    this.isDeleting.set(id);

    this.errorMessage.set('');
    this.successMessage.set('');

    try {

      const { error } =
        await this.supabaseService.client
          .from('memories')
          .delete()
          .eq('id', id);

      if (error) {
        throw error;
      }

      this.memories.update(
        memories =>
          memories.filter(
            memory =>
              memory.id !== id
          )
      );

      this.successMessage.set(
        'Memory deleted successfully.'
      );

    } catch (error: any) {

      console.error(
        'Unable to delete memory:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to delete memory.'
      );

    } finally {

      this.isDeleting.set(null);

    }
  }


  displayName(memory: Memory) {

    if (memory.is_anonymous) {
      return 'Anonymous';
    }

    return (
      memory.name?.trim() ??
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