package com.aidevops.backend.integration;

import com.aidevops.backend.config.AppProperties;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;

@Service
public class GitLabService {

    private final RestClient restClient;
    private final AppProperties appProperties;

    public GitLabService(RestClient restClient, AppProperties appProperties) {
        this.restClient = restClient;
        this.appProperties = appProperties;
    }

    public String fetchJobLog(Long gitlabProjectId, Long gitlabJobId) {
        if (!StringUtils.hasText(appProperties.gitlab().token())) {
            return "GitLab token non configurato: impossibile recuperare il log completo.";
        }

        String path = "/api/v4/projects/" + gitlabProjectId + "/jobs/" + gitlabJobId + "/trace";
        return restClient.get()
                .uri(appProperties.gitlab().baseUrl() + path)
                .accept(MediaType.TEXT_PLAIN)
                .header("PRIVATE-TOKEN", appProperties.gitlab().token())
                .retrieve()
                .body(String.class);
    }
}
