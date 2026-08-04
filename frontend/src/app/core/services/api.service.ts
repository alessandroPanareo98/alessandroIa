import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AiAnalysis, BuildError, Notification, Pipeline, Project } from '../models/devops.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = environment.apiBaseUrl;

  constructor(private readonly http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`${this.base}/projects`).pipe(catchError(() => of(mockProjects)));
  }

  getPipelines(): Observable<Pipeline[]> {
    return this.http.get<Pipeline[]>(`${this.base}/pipelines`).pipe(catchError(() => of(mockPipelines)));
  }

  getErrors(): Observable<BuildError[]> {
    return this.http.get<BuildError[]>(`${this.base}/errors`).pipe(catchError(() => of(mockErrors)));
  }

  getAnalyses(): Observable<AiAnalysis[]> {
    return this.http.get<AiAnalysis[]>(`${this.base}/analyses`).pipe(catchError(() => of(mockAnalyses)));
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.base}/notifications`).pipe(catchError(() => of(mockNotifications)));
  }

  markNotificationAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.base}/notifications/${id}/read`, {}).pipe(
      catchError(() => of(void 0))
    );
  }

  getPipelineTrend(): Observable<{ day: string; failed: number; success: number }[]> {
    return this.getPipelines().pipe(
      map((pipelines) => {
        const bucket = new Map<string, { day: string; failed: number; success: number }>();
        pipelines.forEach((p) => {
          const key = new Date(p.startedAt).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
          if (!bucket.has(key)) {
            bucket.set(key, { day: key, failed: 0, success: 0 });
          }
          const item = bucket.get(key)!;
          if (p.status === 'FAILED') {
            item.failed += 1;
          }
          if (p.status === 'SUCCESS') {
            item.success += 1;
          }
        });
        return Array.from(bucket.values()).slice(-7);
      })
    );
  }
}

const now = new Date();

const mockProjects: Project[] = [
  { id: 1, name: 'backend', path: 'team/backend', webUrl: 'https://gitlab.com/team/backend' },
  { id: 2, name: 'frontend', path: 'team/frontend', webUrl: 'https://gitlab.com/team/frontend' }
];

const mockPipelines: Pipeline[] = [
  { id: 1, gitlabPipelineId: 451, refName: 'develop', status: 'SUCCESS', startedAt: new Date(now.getTime() - 86400000 * 4).toISOString() },
  { id: 2, gitlabPipelineId: 452, refName: 'develop', status: 'FAILED', startedAt: new Date(now.getTime() - 86400000 * 3).toISOString() },
  { id: 3, gitlabPipelineId: 453, refName: 'feature/auth', status: 'SUCCESS', startedAt: new Date(now.getTime() - 86400000 * 2).toISOString() },
  { id: 4, gitlabPipelineId: 454, refName: 'bugfix/webhook', status: 'FAILED', startedAt: new Date(now.getTime() - 86400000).toISOString() },
  { id: 5, gitlabPipelineId: 455, refName: 'main', status: 'RUNNING', startedAt: new Date(now.getTime() - 3600000).toISOString() }
];

const mockErrors: BuildError[] = [
  { id: 1, severity: 'HIGH', title: 'Cannot find symbol UserRepository', details: 'Compilation failed in auth module.', createdAt: new Date(now.getTime() - 86400000).toISOString() },
  { id: 2, severity: 'CRITICAL', title: 'Database migration lock timeout', details: 'Flyway lock contention detected.', createdAt: new Date(now.getTime() - 7200000).toISOString() },
  { id: 3, severity: 'MEDIUM', title: 'npm cache fetch warning', details: 'Transient network issue on dependency resolution.', createdAt: new Date(now.getTime() - 3600000).toISOString() }
];

const mockAnalyses: AiAnalysis[] = [
  { id: 1, severity: 'HIGH', cause: 'Refactor import non aggiornato', solution: 'Aggiornare package e import con percorso corretto', confidence: 0.94, createdAt: new Date(now.getTime() - 86000000).toISOString() },
  { id: 2, severity: 'CRITICAL', cause: 'Concorrenza su lock migration', solution: 'Serializzare deploy o aumentare retry lock', confidence: 0.88, createdAt: new Date(now.getTime() - 7100000).toISOString() }
];

const mockNotifications: Notification[] = [
  { id: 1, channel: 'DASHBOARD', message: 'Errore CRITICAL su pipeline #454', readFlag: false, createdAt: new Date(now.getTime() - 3500000).toISOString() },
  { id: 2, channel: 'SLACK', message: 'Errore HIGH su modulo auth', readFlag: false, createdAt: new Date(now.getTime() - 2500000).toISOString() },
  { id: 3, channel: 'EMAIL', message: 'Trend fail in aumento ultime 24h', readFlag: true, createdAt: new Date(now.getTime() - 9200000).toISOString() }
];
