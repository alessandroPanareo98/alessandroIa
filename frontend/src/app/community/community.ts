import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Community {
  id: number;
  name: string;
  description: string;
  members: number;
  category: string;
  icon: string;
  color: string;
  joined: boolean;
}

@Component({
  selector: 'app-community',
  imports: [CommonModule],
  templateUrl: './community.html',
  styleUrl: './community.scss'
})
export class CommunityComponent {

  communities: Community[] = [
    {
      id: 1,
      name: 'Open Source',
      description: 'Sviluppatori e appassionati che collaborano alla creazione di soluzioni open source.',
      members: 128,
      category: 'Tecnologia',
      icon: '⌘',
      color: 'orange',
      joined: true
    },
    {
      id: 2,
      name: 'AI Community',
      description: 'Condividere conoscenze, idee e progetti legati all’intelligenza artificiale.',
      members: 342,
      category: 'Intelligenza Artificiale',
      icon: '✦',
      color: 'purple',
      joined: false
    },
    {
      id: 3,
      name: 'Gaming',
      description: 'Una community dedicata ai videogiochi, strategie e sviluppo di nuove esperienze.',
      members: 215,
      category: 'Gaming',
      icon: '◈',
      color: 'blue',
      joined: false
    },
    {
      id: 4,
      name: 'Innovazione',
      description: 'Persone interessate a tecnologia, innovazione e sviluppo di nuove idee.',
      members: 96,
      category: 'Innovazione',
      icon: '◇',
      color: 'green',
      joined: false
    }
  ];

  selectedCategory = 'Tutte';

  categories = [
    'Tutte',
    'Tecnologia',
    'Intelligenza Artificiale',
    'Gaming',
    'Innovazione'
  ];

  get filteredCommunities(): Community[] {

    if (this.selectedCategory === 'Tutte') {
      return this.communities;
    }

    return this.communities.filter(
      community => community.category === this.selectedCategory
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  toggleJoin(community: Community): void {
    community.joined = !community.joined;
  }

}