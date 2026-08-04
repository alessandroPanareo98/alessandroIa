package com.aidevops.backend.analysis;

public record AiGenerateResponse(
        String severity,
        String cause,
        String solution,
        double confidence,
        String rawResponse
) {
}
