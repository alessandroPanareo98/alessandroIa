import { computed, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ApiService } from './api.service';
import { AiAnalysis, BuildError, DashboardSummary, Notification, Pipeline, Project } from '../models/devops.models';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  readonly loading = signal(false);
  readonly projects = signal<Project[]>([]);
  readonly pipelines = signal<Pipeline[]>([]);
  readonly errors = signal<BuildError[]>([]);
  readonly analyses = signal<AiAnalysis[]>([]);
  readonly notifications = signal<Notification[]>([]);
  readonly trend = signal<{ day: string; failed: number; success: number }[]>([]);

  readonly summary = computed<DashboardSummary>(() => {
    const pipelines = this.pipelines();
    const analyses = this.analyses();
    const errors = this.errors();

    const total = pipelines.length;
    const failed = pipelines.filter((p) => p.status === 'FAILED').length;
    const success = pipelines.filter((p) => p.status === 'SUCCESS').length;
    const criticalErrors = errors.filter((e) => e.severity === 'CRITICAL').length;
    const avgConfidence = analyses.length
      ? analyses.reduce((acc, item) => acc + item.confidence, 0) / analyses.length
      : 0;

    return {
      totalPipelines: total,
      failedPipelines: failed,
      successRate: total ? Math.round((success / total) * 100) : 0,
      criticalErrors,
      avgConfidence: Math.round(avgConfidence * 100)
    };
  });

  constructor(private readonly api: ApiService) {}

  loadAll(): void {
    this.loading.set(true);

    forkJoin({
      projects: this.api.getProjects(),
      pipelines: this.api.getPipelines(),
      errors: this.api.getErrors(),
      analyses: this.api.getAnalyses(),
      notifications: this.api.getNotifications(),
      trend: this.api.getPipelineTrend()
    }).subscribe({
      next: (data) => {
        this.projects.set(data.projects);
        this.pipelines.set(data.pipelines);
        this.errors.set(data.errors);
        this.analyses.set(data.analyses);
        this.notifications.set(data.notifications);
        this.trend.set(data.trend);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  markRead(id: number): void {
    this.api.markNotificationAsRead(id).subscribe(() => {
      this.notifications.update((items) =>
        items.map((item) => (item.id === id ? { ...item, readFlag: true } : item))
      );
    });
  }
}
