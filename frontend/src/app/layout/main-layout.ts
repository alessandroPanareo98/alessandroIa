import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { ChatComponent } from '../chat/chat';
import { CommunityComponent } from '../community/community';
import { FooterComponent } from '../footer/footer';
import { HeaderComponent } from '../header/header';
import { NewsComponent } from '../news/news';
import { RulesComponent } from '../rules/rules';
type Section =
  | 'home'
  | 'chat'
  | 'news'
  | 'communities'
  | 'knowledge'
  | 'rules'
  | 'settings';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    ChatComponent,
    CommunityComponent,
    FooterComponent,
    HeaderComponent,
    NewsComponent,
    RulesComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {

  private authService = inject(AuthService);
  private router = inject(Router);
  activeSection: Section = 'home';

  sidebarCollapsed = false;

  sectionTitle = 'Benvenuto in Iagora';
  sectionLabel = 'HOME';

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  navigate(section: Section): void {

    this.activeSection = section;

    switch (section) {

      case 'home':
        this.sectionLabel = 'HOME';
        this.sectionTitle = 'Benvenuto in PANAIA';
        break;

      case 'chat':
        this.sectionLabel = 'PANAIA AI';
        this.sectionTitle = 'Chat';
        break;

      case 'news':
        this.sectionLabel = 'PANAIA AI';
        this.sectionTitle = 'News del giorno';
        break;

      case 'communities':
        this.sectionLabel = 'COMMUNITY';
        this.sectionTitle = 'Le community';
        break;

      case 'knowledge':
        this.sectionLabel = 'KNOWLEDGE';
        this.sectionTitle = 'Base di conoscenza';
        break;

      case 'rules':
        this.sectionLabel = 'IAGORA';
        this.sectionTitle = 'Regole della community';
        break;

      case 'settings':
        this.sectionLabel = 'CONFIGURAZIONE';
        this.sectionTitle = 'Impostazioni';
        break;
    }
  }
}