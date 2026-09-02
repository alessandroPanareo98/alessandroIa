package com.aidevops.backend.integration;

import static org.assertj.core.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.*;
import static org.springframework.test.web.client.response.MockRestResponseCreators.*;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import com.aidevops.backend.config.AppProperties;
import com.fasterxml.jackson.databind.ObjectMapper;

class AiClientServiceTest {

    @Test
    void chatUsesOllamaApiAndParsesMessageContent() {
        RestClient.Builder builder = RestClient.builder();
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();

        server.expect(requestTo("http://localhost:11434/api/chat"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("""
                        {
                          "model": "llama3.2",
                          "created_at": "2026-09-02T00:00:00Z",
                          "message": {
                            "role": "assistant",
                            "content": "Ciao! Posso aiutarti."
                          },
                          "done": true
                        }
                        """, MediaType.APPLICATION_JSON));

        AppProperties properties = new AppProperties(
                new AppProperties.Jwt("test-secret", 120),
                new AppProperties.Ai("http://localhost:11434", "/api/chat", "llama3.2"),
                new AppProperties.Gitlab("https://gitlab.com", "", "secret")
        );

        AiClientService service = new AiClientService(builder.build(), properties, new ObjectMapper());

        String result = service.chat("ciao");

        assertThat(result).isEqualTo("Ciao! Posso aiutarti.");
        server.verify();
    }
}
