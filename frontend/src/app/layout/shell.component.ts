import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  links = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'merge', label: 'Pipeline', route: '/pipelines' },
    { icon: 'warning', label: 'Errori', route: '/errors' },
    { icon: 'smart_toy', label: 'Analisi AI', route: '/analyses' },
    { icon: 'notifications', label: 'Notifiche', route: '/notifications' },
    { icon: 'settings', label: 'Impostazioni', route: '/settings' }
  ];
}
