import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DashboardStore } from '../../core/services/dashboard.store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule, BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  readonly store = inject(DashboardStore);

  readonly summary = this.store.summary;

  readonly trendLabels = computed(() => this.store.trend().map((i) => i.day));
  readonly failedSeries = computed(() => this.store.trend().map((i) => i.failed));
  readonly successSeries = computed(() => this.store.trend().map((i) => i.success));

  readonly trendType: ChartType = 'line';
  readonly severityType: ChartType = 'doughnut';

  lineData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Fail',
        data: [],
        borderColor: '#dc2626',
        backgroundColor: 'rgba(220, 38, 38, 0.2)',
        tension: 0.3,
        fill: true
      },
      {
        label: 'Success',
        data: [],
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22, 163, 74, 0.15)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  severityData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    datasets: [
      {
        data: [0, 0, 0, 0],
        backgroundColor: ['#22c55e', '#eab308', '#f97316', '#ef4444']
      }
    ]
  };

  severityOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' }
    }
  };

  constructor() {
    this.store.loadAll();

    effect(() => {
      this.lineData = {
        ...this.lineData,
        labels: this.trendLabels(),
        datasets: [
          { ...this.lineData.datasets[0], data: this.failedSeries() },
          { ...this.lineData.datasets[1], data: this.successSeries() }
        ]
      };

      const severityMap = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
      this.store.errors().forEach((error) => {
        severityMap[error.severity] += 1;
      });

      this.severityData = {
        ...this.severityData,
        datasets: [
          {
            ...this.severityData.datasets[0],
            data: [severityMap.LOW, severityMap.MEDIUM, severityMap.HIGH, severityMap.CRITICAL]
          }
        ]
      };
    });
  }
}
