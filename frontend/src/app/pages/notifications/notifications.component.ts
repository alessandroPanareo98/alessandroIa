import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { DashboardStore } from '../../core/services/dashboard.store';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatListModule, MatButtonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  readonly store = inject(DashboardStore);

  constructor() {
    this.store.loadAll();
  }

  markRead(id: number): void {
    this.store.markRead(id);
  }
}
