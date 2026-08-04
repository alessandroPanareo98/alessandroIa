import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { DashboardStore } from '../../core/services/dashboard.store';

@Component({
  selector: 'app-errors',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatListModule, MatIconModule],
  templateUrl: './errors.component.html',
  styleUrl: './errors.component.scss'
})
export class ErrorsComponent {
  readonly store = inject(DashboardStore);

  constructor() {
    this.store.loadAll();
  }
}
