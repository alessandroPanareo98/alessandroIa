package com.aidevops.backend.webhook;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final WebhookService webhookService;

    public WebhookController(WebhookService webhookService) {
        this.webhookService = webhookService;
    }

    @PostMapping("/gitlab")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void gitLabWebhook(@RequestHeader(name = "X-Gitlab-Token", required = false) String token,
                              @RequestBody JsonNode payload) {
        webhookService.processGitLabEvent(token, payload);
    }
}
