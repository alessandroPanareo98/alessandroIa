CREATE TABLE news_articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(180) NOT NULL,
    summary VARCHAR(500) NOT NULL,
    content VARCHAR(6000) NOT NULL,
    source VARCHAR(120) NOT NULL,
    published_on DATE NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_news_articles_published_on
    ON news_articles (published_on DESC);
