import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../core/supabase';

interface Memory {
  id: string;
  name: string | null;
  message: string;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
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

  private readonly supabaseService = inject(SupabaseService);

  memories = signal<Memory[]>([]);

  isLoading = signal(true);
  isUpdating = signal<string | null>(null);

  errorMessage = signal('');
  successMessage = signal('');

  selectedFilter = signal<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');


  async ngOnInit() {
    await this.loadMemories();
  }


  async loadMemories() {

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {

      const supabase = this.supabaseService.client;

      const { data, error } = await supabase
        .from('memories')
        .select('*')
        .order('created_at', {
          ascending: false
        });

      if (error) {
        throw error;
      }

      this.memories.set(data ?? []);

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


  setFilter(
    filter: 'all' | 'pending' | 'approved' | 'rejected'
  ) {

    this.selectedFilter.set(filter);

  }


  filteredMemories() {

    const filter = this.selectedFilter();

    if (filter === 'all') {
      return this.memories();
    }

    return this.memories().filter(
      memory => memory.status === filter
    );
  }


  async updateStatus(
    id: string,
    status: 'approved' | 'rejected'
  ) {

    this.isUpdating.set(id);

    this.errorMessage.set('');
    this.successMessage.set('');

    try {

      const { error } =
        await this.supabaseService.client
          .from('memories')
          .update({
            status,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);

      if (error) {
        throw error;
      }

      this.memories.update(
        memories =>
          memories.map(memory =>
            memory.id === id
              ? {
                  ...memory,
                  status
                }
              : memory
          )
      );

      this.successMessage.set(
        status === 'approved'
          ? 'Memory approved successfully.'
          : 'Memory rejected successfully.'
      );

    } catch (error: any) {

      console.error(
        'Unable to update memory:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to update memory.'
      );

    } finally {

      this.isUpdating.set(null);

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

    this.isUpdating.set(id);

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
            memory => memory.id !== id
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

      this.isUpdating.set(null);

    }
  }


  formatDate(date: string) {

    return new Intl.DateTimeFormat(
      'en-PH',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(new Date(date));

  }

}