package com.aidevops.backend.news;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class NewsScheduler {

    private final NewsService newsService;

    public NewsScheduler(NewsService newsService) {
        this.newsService = newsService;
    }

    @Scheduled(cron = "${app.news.cron:0 0 7 * * *}")
    public void publishDailyNews() {
        newsService.generateTodayIfMissing();
    }
}
