import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SupabaseService } from '../../core/supabase';

interface ApprovedMemory {
  id: string;
  name: string | null;
  message: string;
  is_anonymous: boolean;
  created_at: string;
}

@Component({
  selector: 'app-memories',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './memories.html',
  styleUrl: './memories.scss'
})
export class Memories implements OnInit {

  private readonly supabaseService =
    inject(SupabaseService);


  // ================================
  // SUBMISSION FORM
  // ================================

  name = '';

  message = '';

  isAnonymous = true;

  isSubmitting = signal(false);

  submitted = signal(false);

  errorMessage = signal('');


  // ================================
  // PUBLIC MEMORIES
  // ================================

  approvedMemories =
    signal<ApprovedMemory[]>([]);

  isLoadingMemories =
    signal(true);


  // ================================
  // INITIALIZE
  // ================================

  async ngOnInit() {

    await this.loadApprovedMemories();

  }


  // ================================
  // LOAD APPROVED MEMORIES
  // ================================

  async loadApprovedMemories() {

    this.isLoadingMemories.set(true);

    try {

      const {
        data,
        error
      } = await this.supabaseService.client
        .from('memories')
        .select(
          'id, name, message, is_anonymous, created_at'
        )
        .eq('status', 'approved')
        .order(
          'created_at',
          {
            ascending: false
          }
        );

      if (error) {
        throw error;
      }

      this.approvedMemories.set(
        data ?? []
      );

    } catch (error) {

      console.error(
        'Unable to load approved memories:',
        error
      );

    } finally {

      this.isLoadingMemories.set(false);

    }
  }


  // ================================
  // SUBMIT MEMORY
  // ================================

  async submitMemory() {

    this.errorMessage.set('');

    const trimmedName =
      this.name.trim();

    const trimmedMessage =
      this.message.trim();


    // Message required
    if (!trimmedMessage) {

      this.errorMessage.set(
        'Please write your memory before submitting.'
      );

      return;
    }


    // Minimum message length
    if (trimmedMessage.length < 10) {

      this.errorMessage.set(
        'Your memory should be at least 10 characters long.'
      );

      return;
    }


    this.isSubmitting.set(true);


    try {

      const {
        error
      } = await this.supabaseService.client
        .from('memories')
        .insert({
          name: this.isAnonymous
            ? null
            : trimmedName || null,

          message: trimmedMessage,

          is_anonymous:
            this.isAnonymous,

          status: 'pending'
        });


      if (error) {
        throw error;
      }


      // Success
      this.submitted.set(true);

      this.name = '';

      this.message = '';

      this.isAnonymous = true;


    } catch (error: any) {

      console.error(
        'Memory submission error:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Something went wrong while submitting your memory. Please try again.'
      );

    } finally {

      this.isSubmitting.set(false);

    }

  }


  // ================================
  // SUBMIT ANOTHER MEMORY
  // ================================

  submitAnother() {

    this.submitted.set(false);

    this.errorMessage.set('');

  }


  // ================================
  // DATE FORMAT
  // ================================

  formatDate(date: string) {

    return new Intl.DateTimeFormat(
      'en-PH',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      }
    ).format(
      new Date(date)
    );

  }

}