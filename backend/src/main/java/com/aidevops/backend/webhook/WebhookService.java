package com.aidevops.backend.webhook;

import com.aidevops.backend.analysis.AiAnalysisService;
import com.aidevops.backend.config.AppProperties;
import com.aidevops.backend.error.BuildError;
import com.aidevops.backend.error.BuildErrorRepository;
import com.aidevops.backend.error.Severity;
import com.aidevops.backend.integration.GitLabService;
import com.aidevops.backend.notification.NotificationService;
import com.aidevops.backend.pipeline.Job;
import com.aidevops.backend.pipeline.JobRepository;
import com.aidevops.backend.pipeline.Pipeline;
import com.aidevops.backend.pipeline.PipelineRepository;
import com.aidevops.backend.pipeline.PipelineStatus;
import com.aidevops.backend.project.Project;
import com.aidevops.backend.project.ProjectRepository;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class WebhookService {

    private final AppProperties appProperties;
    private final ProjectRepository projectRepository;
    private final PipelineRepository pipelineRepository;
    private final JobRepository jobRepository;
    private final BuildErrorRepository buildErrorRepository;
    private final AiAnalysisService aiAnalysisService;
    private final NotificationService notificationService;
    private final GitLabService gitLabService;

    public WebhookService(AppProperties appProperties,
                          ProjectRepository projectRepository,
                          PipelineRepository pipelineRepository,
                          JobRepository jobRepository,
                          BuildErrorRepository buildErrorRepository,
                          AiAnalysisService aiAnalysisService,
                          NotificationService notificationService,
                          GitLabService gitLabService) {
        this.appProperties = appProperties;
        this.projectRepository = projectRepository;
        this.pipelineRepository = pipelineRepository;
        this.jobRepository = jobRepository;
        this.buildErrorRepository = buildErrorRepository;
        this.aiAnalysisService = aiAnalysisService;
        this.notificationService = notificationService;
        this.gitLabService = gitLabService;
    }

    @Transactional
    public void processGitLabEvent(String providedToken, JsonNode payload) {
        if (!appProperties.gitlab().webhookToken().equals(providedToken)) {
            throw new IllegalArgumentException("Invalid webhook token");
        }

        Long gitlabProjectId = payload.path("project").path("id").asLong();
        String projectName = payload.path("project").path("name").asText("unknown-project");
        String projectPath = payload.path("project").path("path_with_namespace").asText(projectName);
        String webUrl = payload.path("project").path("web_url").asText("");

        Long gitlabPipelineId = payload.path("object_attributes").path("id").asLong();
        String ref = payload.path("object_attributes").path("ref").asText("unknown");
        String statusText = payload.path("object_attributes").path("status").asText("running");
        PipelineStatus status = parseStatus(statusText);

        String pipelineName = payload.path("object_attributes").path("name").asText("pipeline-" + gitlabPipelineId);
        String commitMessage = payload.path("commit").path("message").asText("N/A");

        Project project = projectRepository.findByGitlabProjectId(gitlabProjectId).orElseGet(() -> {
            Project p = new Project();
            p.setGitlabProjectId(gitlabProjectId);
            p.setName(projectName);
            p.setPath(projectPath);
            p.setWebUrl(webUrl);
            return projectRepository.save(p);
        });

        Pipeline pipeline = pipelineRepository.findByGitlabPipelineId(gitlabPipelineId).orElseGet(() -> {
            Pipeline p = new Pipeline();
            p.setGitlabPipelineId(gitlabPipelineId);
            p.setProject(project);
            p.setRefName(ref);
            p.setStartedAt(OffsetDateTime.now());
            return p;
        });
        pipeline.setStatus(status);
        if (status == PipelineStatus.FAILED || status == PipelineStatus.SUCCESS || status == PipelineStatus.CANCELED) {
            pipeline.setFinishedAt(OffsetDateTime.now());
        }
        pipelineRepository.save(pipeline);

        if (status != PipelineStatus.FAILED) {
            return;
        }

        Long gitlabJobId = payload.path("builds").path(0).path("id").asLong(gitlabPipelineId * 1000);
        String failedJobName = payload.path("builds").path(0).path("name").asText("failed-job");

        Job job = jobRepository.findByGitlabJobId(gitlabJobId).orElseGet(() -> {
            Job j = new Job();
            j.setGitlabJobId(gitlabJobId);
            j.setPipeline(pipeline);
            return j;
        });
        job.setName(failedJobName);
        job.setStatus(PipelineStatus.FAILED);

        String log = gitLabService.fetchJobLog(gitlabProjectId, gitlabJobId);
        if (log != null && log.length() > 4000) {
            log = log.substring(0, 4000);
        }
        job.setLogExcerpt(log);
        jobRepository.save(job);

        BuildError buildError = new BuildError();
        buildError.setJob(job);
        buildError.setSeverity(Severity.HIGH);
        buildError.setTitle("Pipeline fallita: " + pipelineName);
        buildError.setDetails(log == null ? "Log non disponibile" : log);
        buildErrorRepository.save(buildError);

        aiAnalysisService.analyzeAndSave(buildError, pipelineName, commitMessage, buildError.getDetails());

        if (notificationService.shouldNotify(buildError.getSeverity())) {
            notificationService.createForError(buildError);
        }
    }

    private PipelineStatus parseStatus(String statusText) {
        return switch (statusText.toLowerCase()) {
            case "failed" -> PipelineStatus.FAILED;
            case "success" -> PipelineStatus.SUCCESS;
            case "canceled" -> PipelineStatus.CANCELED;
            default -> PipelineStatus.RUNNING;
        };
    }
}
