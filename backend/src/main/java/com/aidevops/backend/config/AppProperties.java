package com.aidevops.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app")
public record AppProperties(
        Jwt jwt,
        Ai ai,
        Gitlab gitlab
) {
    public record Jwt(String secret, long expirationMinutes) {
    }

    public record Ai(String baseUrl, String generatePath, String model) {
    }

    public record Gitlab(String baseUrl, String token, String webhookToken) {
    }
}
