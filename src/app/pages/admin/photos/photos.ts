import { Component, inject, signal } from '@angular/core';
import { SupabaseService } from '../../../core/supabase';

interface Photo {
  id: string;
  name: string | null;
  caption: string | null;
  image_url: string | null;
  storage_path: string;
  is_anonymous: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  previewUrl?: string;
}

@Component({
  selector: 'app-admin-photos',
  imports: [],
  templateUrl: './photos.html',
  styleUrl: './photos.scss'
})
export class AdminPhotos {
  private readonly supabaseService = inject(SupabaseService);

  photos = signal<Photo[]>([]);

  isLoading = signal(true);
  isUpdating = signal<string | null>(null);

  errorMessage = signal('');
  successMessage = signal('');

  selectedFilter = signal<
    'all' | 'pending' | 'approved' | 'rejected'
  >('all');

  async ngOnInit() {
    await this.loadPhotos();
  }

  async loadPhotos() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const supabase = this.supabaseService.client;

      const { data, error } = await supabase
        .from('photos')
        .select('*')
        .order('created_at', {
          ascending: false
        });

      if (error) {
        throw error;
      }

      const photos = (data ?? []) as Photo[];

      /*
       * Create signed URLs for photo previews.
       *
       * The bucket is private, so the browser cannot
       * directly access the stored image.
       */
      const photosWithUrls = await Promise.all(
        photos.map(async photo => {
          if (!photo.storage_path) {
            return photo;
          }

          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from('anniversary-photos')
              .createSignedUrl(
                photo.storage_path,
                3600
              );

          if (signedUrlError) {
            console.error(
              'Unable to create signed URL:',
              signedUrlError
            );

            return photo;
          }

          return {
            ...photo,
            previewUrl:
              signedUrlData?.signedUrl ?? undefined
          };
        })
      );

      this.photos.set(photosWithUrls);
    } catch (error: any) {
      console.error(
        'Unable to load photos:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to load submitted photos.'
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
    this.selectedFilter.set(filter);
  }

  filteredPhotos() {
    const filter = this.selectedFilter();

    if (filter === 'all') {
      return this.photos();
    }

    return this.photos().filter(
      photo => photo.status === filter
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
      return this.photos().length;
    }

    return this.photos().filter(
      photo => photo.status === status
    ).length;
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
          .from('photos')
          .update({
            status,
            updated_at:
              new Date().toISOString()
          })
          .eq('id', id);

      if (error) {
        throw error;
      }

      this.photos.update(
        photos =>
          photos.map(photo =>
            photo.id === id
              ? {
                  ...photo,
                  status
                }
              : photo
          )
      );

      this.successMessage.set(
        status === 'approved'
          ? 'Photo approved successfully.'
          : 'Photo rejected successfully.'
      );
    } catch (error: any) {
      console.error(
        'Unable to update photo:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to update photo.'
      );
    } finally {
      this.isUpdating.set(null);
    }
  }

  async deletePhoto(id: string) {
    const photo =
      this.photos().find(
        item => item.id === id
      );

    if (!photo) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to permanently delete this photo?'
      );

    if (!confirmed) {
      return;
    }

    this.isUpdating.set(id);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const supabase =
        this.supabaseService.client;

      /*
       * First remove the actual image from
       * Supabase Storage.
       */
      if (photo.storage_path) {
        const { error: storageError } =
          await supabase.storage
            .from('anniversary-photos')
            .remove([
              photo.storage_path
            ]);

        if (storageError) {
          throw storageError;
        }
      }

      /*
       * Then remove the database record.
       */
      const { error: databaseError } =
        await supabase
          .from('photos')
          .delete()
          .eq('id', id);

      if (databaseError) {
        throw databaseError;
      }

      this.photos.update(
        photos =>
          photos.filter(
            item => item.id !== id
          )
      );

      this.successMessage.set(
        'Photo deleted successfully.'
      );
    } catch (error: any) {
      console.error(
        'Unable to delete photo:',
        error
      );

      this.errorMessage.set(
        error?.message ??
        'Unable to delete photo.'
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

  displayName(photo: Photo) {
    if (photo.is_anonymous) {
      return 'Anonymous';
    }

    return photo.name?.trim() || 'Anonymous';
  }
}