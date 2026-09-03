package com.aidevops.backend.news;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.aidevops.backend.integration.AiClientService;

@Service
public class NewsService {

    private final NewsArticleRepository newsArticleRepository;
    private final AiClientService aiClientService;

    public NewsService(NewsArticleRepository newsArticleRepository, AiClientService aiClientService) {
        this.newsArticleRepository = newsArticleRepository;
        this.aiClientService = aiClientService;
    }

    @Transactional(readOnly = true)
    public List<NewsArticle> findLatest() {
        return newsArticleRepository.findTop20ByOrderByPublishedOnDesc();
    }

    @Transactional
    public NewsArticle generateTodayIfMissing() {
        LocalDate today = LocalDate.now();
        return newsArticleRepository.findByPublishedOn(today)
                .orElseGet(() -> {
                    NewsDraft draft = aiClientService.generateDailyNews();
                    NewsArticle article = new NewsArticle();
                    article.setTitle(draft.title());
                    article.setSummary(draft.summary());
                    article.setContent(draft.content());
                    article.setSource(draft.source());
                    article.setPublishedOn(today);
                    return newsArticleRepository.save(article);
                });
    }
}
