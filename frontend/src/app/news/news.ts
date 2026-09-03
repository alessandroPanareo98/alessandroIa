import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { NewsArticle, NewsService } from '../services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class NewsComponent implements OnInit {
  private readonly newsService = inject(NewsService);

  articles: NewsArticle[] = [];
  loading = true;
  error = false;

  ngOnInit(): void {
    this.loadNews();
  }

  loadNews(): void {
    this.loading = true;
    this.error = false;
    this.newsService.getLatest().subscribe({
      next: articles => {
        this.articles = articles;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
}
