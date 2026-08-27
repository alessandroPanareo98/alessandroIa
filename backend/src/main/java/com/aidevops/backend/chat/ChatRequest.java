package com.aidevops.backend.chat;

import jakarta.validation.constraints.NotBlank;

public record ChatRequest(
        @NotBlank(message = "Il messaggio non può essere vuoto") String message,
        String conversationId
) {
}