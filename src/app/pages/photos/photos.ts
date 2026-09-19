import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { SupabaseService } from '../../core/supabase';

interface ApprovedPhoto {
  id: string;
  name: string | null;
  caption: string | null;
  image_url: string | null;
  storage_path: string;
  is_anonymous: boolean;
  created_at: string;
  signedUrl?: string;
}

@Component({
  selector: 'app-photos',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './photos.html',
  styleUrl: './photos.scss'
})
export class Photos implements OnInit {

  private readonly supabaseService =
    inject(SupabaseService);


  // ==========================================
  // FORM
  // ==========================================

  name = '';

  caption = '';

  isAnonymous = true;

  selectedFile: File | null = null;

  isUploading = signal(false);

  uploaded = signal(false);

  errorMessage = signal('');


  // ==========================================
  // PUBLIC PHOTOS
  // ==========================================

  approvedPhotos =
    signal<ApprovedPhoto[]>([]);

  isLoadingPhotos =
    signal(true);


  // ==========================================
  // INITIALIZE
  // ==========================================

  async ngOnInit() {

    await this.loadApprovedPhotos();

  }


  // ==========================================
  // FILE SELECTION
  // ==========================================

  onFileSelected(
    event: Event
  ) {

    const input =
      event.target as HTMLInputElement;

    const file =
      input.files?.[0] ?? null;

    this.errorMessage.set('');

    if (!file) {

      this.selectedFile = null;

      return;

    }


    // Maximum 10 MB
    if (file.size > 10 * 1024 * 1024) {

      this.errorMessage.set(
        'The photo must be smaller than 10 MB.'
      );

      input.value = '';

      this.selectedFile = null;

      return;

    }


    // Image files only
    if (!file.type.startsWith('image/')) {

      this.errorMessage.set(
        'Please select a valid image file.'
      );

      input.value = '';

      this.selectedFile = null;

      return;

    }


    this.selectedFile = file;

  }


  // ==========================================
  // UPLOAD PHOTO
  // ==========================================

  async uploadPhoto() {

    this.errorMessage.set('');

    const file =
      this.selectedFile;


    if (!file) {

      this.errorMessage.set(
        'Please select a photo first.'
      );

      return;

    }


    this.isUploading.set(true);


    try {

      const supabase =
        this.supabaseService.client;


      // Unique file name
      const fileExtension =
        file.name.split('.').pop() || 'jpg';

      const uniqueName =
        `${crypto.randomUUID()}.${fileExtension}`;


      const storagePath =
        `pending/${uniqueName}`;


      // ========================================
      // UPLOAD TO STORAGE
      // ========================================

      const {
        error: uploadError
      } = await supabase.storage
        .from('anniversary-photos')
        .upload(
          storagePath,
          file,
          {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
          }
        );


      if (uploadError) {
        throw uploadError;
      }


      // ========================================
      // INSERT DATABASE RECORD
      // ========================================

      const trimmedName =
        this.name.trim();

      const trimmedCaption =
        this.caption.trim();


      const {
        error: databaseError
      } = await supabase
        .from('photos')
        .insert({

          name:
            this.isAnonymous
              ? null
              : trimmedName || null,

          caption:
            trimmedCaption || null,

          image_url: null,

          storage_path: storagePath,

          is_anonymous:
            this.isAnonymous,

          status: 'pending'

        });


      if (databaseError) {

        // Remove orphaned file
        await supabase.storage
          .from('anniversary-photos')
          .remove([storagePath]);

        throw databaseError;

      }


      // ========================================
      // SUCCESS
      // ========================================

      this.uploaded.set(true);

      this.name = '';

      this.caption = '';

      this.isAnonymous = true;

      this.selectedFile = null;


    } catch (error: any) {

      console.error(
        'Photo upload error:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to upload your photo.'
      );

    } finally {

      this.isUploading.set(false);

    }

  }


  // ==========================================
  // RESET FORM
  // ==========================================

  uploadAnother() {

    this.uploaded.set(false);

    this.errorMessage.set('');

  }


  // ==========================================
  // LOAD APPROVED PHOTOS
  // ==========================================

  async loadApprovedPhotos() {

    this.isLoadingPhotos.set(true);

    try {

      const supabase =
        this.supabaseService.client;


      const {
        data,
        error
      } = await supabase
        .from('photos')
        .select(
          'id, name, caption, image_url, storage_path, is_anonymous, created_at'
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


      const photos =
        data ?? [];


      // ========================================
      // CREATE SIGNED URLS
      // ========================================

      const photosWithUrls:
        ApprovedPhoto[] = [];


      for (const photo of photos) {

        if (photo.image_url) {

          photosWithUrls.push({
            ...photo,
            signedUrl: photo.image_url
          });

          continue;

        }


        const {
          data: signedData,
          error: signedError
        } = await supabase.storage
          .from('anniversary-photos')
          .createSignedUrl(
            photo.storage_path,
            3600
          );


        if (signedError) {

          console.error(
            'Unable to create photo URL:',
            signedError
          );

          continue;

        }


        photosWithUrls.push({

          ...photo,

          signedUrl:
            signedData.signedUrl

        });

      }


      this.approvedPhotos.set(
        photosWithUrls
      );


    } catch (error) {

      console.error(
        'Unable to load approved photos:',
        error
      );

    } finally {

      this.isLoadingPhotos.set(false);

    }

  }

}