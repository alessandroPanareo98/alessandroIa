package com.aidevops.backend.auth;

public record AuthResponse(
        String accessToken,
        String tokenType,
        long expiresInMinutes,
        String email,
        String role
) {
}
