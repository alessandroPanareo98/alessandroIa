import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CommunityRule {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  priority: number;
}

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  role: 'MEMBER' | 'ADMIN';
  rulesCount: number;
}

@Component({
  selector: 'app-rules',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './rules.html',
  styleUrl: './rules.scss'
})
export class RulesComponent {

  communities: Community[] = [
    {
      id: 1,
      name: 'Open Source',
      description: 'Community dedicata alla collaborazione e allo sviluppo open source.',
      members: 128,
      role: 'ADMIN',
      rulesCount: 5
    },
    {
      id: 2,
      name: 'AI Community',
      description: 'Condivisione di conoscenze e progetti sull’intelligenza artificiale.',
      members: 342,
      role: 'MEMBER',
      rulesCount: 8
    },
    {
      id: 3,
      name: 'Gaming',
      description: 'Videogiochi, strategie e sviluppo di nuove esperienze.',
      members: 215,
      role: 'MEMBER',
      rulesCount: 4
    }
  ];

  selectedCommunity: Community = this.communities[0];

  rules: CommunityRule[] = [
    {
      id: 1,
      name: 'Rispetto della community',
      description: 'PANAIA deve mantenere un comportamento rispettoso verso tutti i membri.',
      enabled: true,
      priority: 1
    },
    {
      id: 2,
      name: 'Collaborazione',
      description: 'PANAIA deve favorire la collaborazione e la condivisione delle conoscenze.',
      enabled: true,
      priority: 2
    },
    {
      id: 3,
      name: 'Condivisione della conoscenza',
      description: 'Le risposte devono favorire la diffusione della conoscenza all’interno della community.',
      enabled: true,
      priority: 3
    },
    {
      id: 4,
      name: 'Specializzazione AI',
      description: 'PANAIA deve adattare le proprie risposte agli obiettivi e agli interessi della community.',
      enabled: true,
      priority: 4
    },
    {
      id: 5,
      name: 'Trasparenza',
      description: 'PANAIA deve dichiarare quando non dispone di informazioni sufficienti.',
      enabled: true,
      priority: 5
    }
  ];

  newRuleName = '';
  newRuleDescription = '';

  selectCommunity(community: Community): void {
    this.selectedCommunity = community;
  }

  toggleRule(rule: CommunityRule): void {

    if (this.selectedCommunity.role !== 'ADMIN') {
      return;
    }

    rule.enabled = !rule.enabled;
  }

  addRule(): void {

    if (this.selectedCommunity.role !== 'ADMIN') {
      return;
    }

    if (
      !this.newRuleName.trim() ||
      !this.newRuleDescription.trim()
    ) {
      return;
    }

    const newRule: CommunityRule = {
      id: Date.now(),
      name: this.newRuleName.trim(),
      description: this.newRuleDescription.trim(),
      enabled: true,
      priority: this.rules.length + 1
    };

    this.rules.push(newRule);

    this.newRuleName = '';
    this.newRuleDescription = '';
  }

  becomeAdmin(community: Community): void {

    // Mock: in futuro questa operazione passerà dal backend
    community.role = 'ADMIN';

    this.selectedCommunity = community;
  }

  createCommunity(): void {

    // Placeholder per il futuro backend
    console.log('Creazione nuova community');
  }

}