package com.aidevops.backend.analysis;

import com.aidevops.backend.error.BuildError;
import com.aidevops.backend.error.Severity;
import com.aidevops.backend.integration.AiClientService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AiAnalysisService {

    private final AiAnalysisRepository aiAnalysisRepository;
    private final AiClientService aiClientService;

    public AiAnalysisService(AiAnalysisRepository aiAnalysisRepository, AiClientService aiClientService) {
        this.aiAnalysisRepository = aiAnalysisRepository;
        this.aiClientService = aiClientService;
    }

    public List<AiAnalysis> findAll() {
        return aiAnalysisRepository.findAll();
    }

    @Transactional
    public AiAnalysis analyzeAndSave(BuildError error, String pipelineName, String commitMessage, String logText) {
        return aiAnalysisRepository.findByErrorId(error.getId()).orElseGet(() -> {
            AiGenerateResponse response = aiClientService.analyzeLog(pipelineName, error.getTitle(), commitMessage, logText);

            AiAnalysis analysis = new AiAnalysis();
            analysis.setError(error);
            analysis.setSeverity(normalizeSeverity(response.severity()).name());
            analysis.setCause(response.cause());
            analysis.setSolution(response.solution());
            analysis.setConfidence(response.confidence());
            analysis.setRawResponse(response.rawResponse());
            return aiAnalysisRepository.save(analysis);
        });
    }

    private Severity normalizeSeverity(String value) {
        try {
            return Severity.valueOf(value == null ? "MEDIUM" : value.toUpperCase());
        } catch (Exception ex) {
            return Severity.MEDIUM;
        }
    }
}
