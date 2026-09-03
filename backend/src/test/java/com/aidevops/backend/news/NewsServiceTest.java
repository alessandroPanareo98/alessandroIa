package com.aidevops.backend.news;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.aidevops.backend.integration.AiClientService;

@ExtendWith(MockitoExtension.class)
class NewsServiceTest {

    @Mock
    private NewsArticleRepository newsArticleRepository;

    @Mock
    private AiClientService aiClientService;

    @InjectMocks
    private NewsService newsService;

    @Test
    void findLatest_shouldGenerateTodayNewsWhenMissing() {
        when(newsArticleRepository.findTop20ByOrderByPublishedOnDesc()).thenReturn(List.of());
        when(newsArticleRepository.findByPublishedOn(LocalDate.now())).thenReturn(Optional.empty());
        when(aiClientService.generateDailyNews()).thenReturn(new NewsDraft(
                "Titolo di prova",
                "Sintesi di prova",
                "Contenuto di prova",
                "PANAIA"
        ));
        when(newsArticleRepository.save(org.mockito.ArgumentMatchers.any(NewsArticle.class)))
                .thenAnswer(invocation -> {
                    NewsArticle article = invocation.getArgument(0);
                    article.setId(99L);
                    return article;
                });

        List<NewsArticle> latest = newsService.findLatest();

        assertNotNull(latest);
        assertEquals(1, latest.size());
        verify(aiClientService).generateDailyNews();
    }
}
