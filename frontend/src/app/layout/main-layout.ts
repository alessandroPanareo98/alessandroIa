import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ChatComponent } from '../chat/chat';
import { CommunityComponent } from '../community/community';
import { FooterComponent } from '../footer/footer';
import { HeaderComponent } from '../header/header';
import { RulesComponent } from '../rules/rules';

type Section =
  | 'home'
  | 'chat'
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
    RulesComponent
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayoutComponent {

  activeSection: Section = 'home';

  sidebarCollapsed = false;

  sectionTitle = 'Benvenuto in Iagora';
  sectionLabel = 'HOME';

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
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