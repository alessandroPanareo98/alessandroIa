import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { DashboardStore } from '../../core/services/dashboard.store';

@Component({
  selector: 'app-pipelines',
  standalone: true,
  imports: [CommonModule, DatePipe, MatCardModule, MatTableModule, MatChipsModule],
  templateUrl: './pipelines.component.html',
  styleUrl: './pipelines.component.scss'
})
export class PipelinesComponent {
  readonly store = inject(DashboardStore);
  readonly columns = ['id', 'ref', 'status', 'startedAt'];

  constructor() {
    this.store.loadAll();
  }
}
