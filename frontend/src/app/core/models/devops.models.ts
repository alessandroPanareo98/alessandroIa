export interface Project {
  id: number;
  name: string;
  path: string;
  webUrl: string;
}

export interface Pipeline {
  id: number;
  gitlabPipelineId: number;
  refName: string;
  status: 'SUCCESS' | 'FAILED' | 'RUNNING' | 'CANCELED';
  startedAt: string;
  finishedAt?: string;
}

export interface BuildError {
  id: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  details: string;
  createdAt: string;
}

export interface AiAnalysis {
  id: number;
  severity: string;
  cause: string;
  solution: string;
  confidence: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  channel: string;
  message: string;
  readFlag: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalPipelines: number;
  failedPipelines: number;
  successRate: number;
  criticalErrors: number;
  avgConfidence: number;
}
