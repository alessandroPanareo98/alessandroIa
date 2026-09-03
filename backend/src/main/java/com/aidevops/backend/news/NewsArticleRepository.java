package com.aidevops.backend.news;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsArticleRepository extends JpaRepository<NewsArticle, Long> {
    List<NewsArticle> findTop20ByOrderByPublishedOnDesc();
    Optional<NewsArticle> findByPublishedOn(LocalDate publishedOn);
}
