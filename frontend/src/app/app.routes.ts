import { Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login';
import { RegisterComponent } from './auth/register/register';
import { MainLayoutComponent } from './layout/main-layout';

import { authGuard } from './auth.guard';

export const routes: Routes = [

  // =========================
  // AREA PUBBLICA
  // =========================

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  // =========================
  // AREA PRIVATA
  // =========================

  {
    path: 'app',
    component: MainLayoutComponent,
    canActivate: [authGuard]
  },

  // =========================
  // DEFAULT
  // =========================

  {
    path: '',
    redirectTo: 'app',
    pathMatch: 'full'
  },

  {
    path: '**',
    redirectTo: 'app'
  }
];