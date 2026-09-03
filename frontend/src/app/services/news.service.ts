import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  content: string;
  source: string;
  publishedOn: string;
}

@Injectable({ providedIn: 'root' })
export class NewsService {
  private readonly http = inject(HttpClient);

  getLatest(): Observable<NewsArticle[]> {
    return this.http.get<NewsArticle[]>('/api/news');
  }
}
