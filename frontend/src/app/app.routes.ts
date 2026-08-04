import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent)
      },
      {
        path: 'pipelines',
        loadComponent: () => import('./pages/pipelines/pipelines.component').then((m) => m.PipelinesComponent)
      },
      {
        path: 'errors',
        loadComponent: () => import('./pages/errors/errors.component').then((m) => m.ErrorsComponent)
      },
      {
        path: 'analyses',
        loadComponent: () => import('./pages/analyses/analyses.component').then((m) => m.AnalysesComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then((m) => m.NotificationsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
