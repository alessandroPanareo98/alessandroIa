package com.aidevops.backend.integration;

import java.util.List;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.aidevops.backend.analysis.AiGenerateResponse;
import com.aidevops.backend.config.AppProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AiClientService {

    private final RestClient restClient;
    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;

    public AiClientService(RestClient restClient, AppProperties appProperties, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.appProperties = appProperties;
        this.objectMapper = objectMapper;
    }

    public AiGenerateResponse analyzeLog(String pipelineName, String errorTitle, String commitMessage, String logText) {
        String prompt = buildPrompt(pipelineName, errorTitle, commitMessage, logText);

        Map<String, Object> payload = Map.of(
                "model", appProperties.ai().model(),
                "messages", List.of(
                        Map.of("role", "system", "content", "Sei un assistente DevOps. Rispondi in JSON con campi severity, cause, solution, confidence."),
                        Map.of("role", "user", "content", prompt)
                ),
                "temperature", 0.2
        );

        String endpoint = appProperties.ai().baseUrl() + appProperties.ai().generatePath();
        String raw = restClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);

        return parseResponse(raw);
    }

    public String chat(String message) {
        Map<String, Object> payload = Map.of(
                "model", appProperties.ai().model(),
                "messages", List.of(
                        Map.of("role", "system", "content", "Sei un assistente DevOps. Rispondi in italiano in modo chiaro e pratico."),
                        Map.of("role", "user", "content", message)
                ),
                "temperature", 0.2
        );

        String endpoint = appProperties.ai().baseUrl() + appProperties.ai().generatePath();
        String raw = restClient.post()
                .uri(endpoint)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);

        try {
            JsonNode content = objectMapper.readTree(raw).path("choices").path(0).path("message").path("content");
            if (!content.isMissingNode() && !content.asText().isBlank()) {
                return content.asText();
            }
        } catch (Exception ignored) {
            // Restituisce un messaggio controllato al posto del JSON grezzo del provider.
        }

        return "Non sono riuscito a interpretare la risposta del modello.";
    }

    private String buildPrompt(String pipelineName, String errorTitle, String commitMessage, String logText) {
        return "Pipeline: " + pipelineName + "\n" +
                "Errore: " + errorTitle + "\n" +
                "Commit: " + commitMessage + "\n" +
                "Log: \n" + logText + "\n\n" +
                "Analizza: causa, priorita, soluzione, confidence.";
    }

    private AiGenerateResponse parseResponse(String raw) {
        try {
            JsonNode root = objectMapper.readTree(raw);
            JsonNode messageContent = root.path("choices").path(0).path("message").path("content");
            if (!messageContent.isMissingNode()) {
                JsonNode parsed = objectMapper.readTree(messageContent.asText());
                return new AiGenerateResponse(
                        parsed.path("severity").asText("MEDIUM"),
                        parsed.path("cause").asText("N/A"),
                        parsed.path("solution").asText("N/A"),
                        parsed.path("confidence").asDouble(0.5),
                        raw
                );
            }
        } catch (Exception ignored) {
            // fallback gestito sotto
        }

        return new AiGenerateResponse("MEDIUM", "Risposta non parsabile", "Verificare manualmente il log", 0.4, raw);
    }
}
