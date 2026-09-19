import { Routes } from '@angular/router';

import { Admin } from './pages/admin/admin';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { adminGuard } from './core/admin-guard';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home').then(m => m.Home)
  },

  {
    path: 'story',
    loadComponent: () =>
      import('./pages/story/story').then(m => m.Story)
  },

  {
    path: 'memories',
    loadComponent: () =>
      import('./pages/memories/memories').then(m => m.Memories)
  },

  {
    path: 'photos',
    loadComponent: () =>
      import('./pages/photos/photos').then(m => m.Photos)
  },

  {
    path: 'messages',
    loadComponent: () =>
      import('./pages/messages/messages').then(m => m.Messages)
  },

  // Admin Login
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.Admin)
  },

  // Protected Admin Dashboard
  {
    path: 'admin/dashboard',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/dashboard/dashboard').then(m => m.Dashboard)
  },

  {
  path: 'admin/memories',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./pages/admin/memories/memories')
      .then(m => m.AdminMemories)
},

{
  path: 'admin/photos',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./pages/admin/photos/photos')
      .then(m => m.AdminPhotos)
},

{
  path: 'admin/messages',
  canActivate: [adminGuard],
  loadComponent: () =>
    import('./pages/admin/messages/messages')
      .then(m => m.AdminMessages)
},

  {
    path: '**',
    redirectTo: ''
  }

];