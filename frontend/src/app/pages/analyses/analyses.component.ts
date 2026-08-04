import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { DashboardStore } from '../../core/services/dashboard.store';

@Component({
  selector: 'app-analyses',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule],
  templateUrl: './analyses.component.html',
  styleUrl: './analyses.component.scss'
})
export class AnalysesComponent {
  readonly store = inject(DashboardStore);

  constructor() {
    this.store.loadAll();
  }
}
