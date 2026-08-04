package com.aidevops.backend.error;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BuildErrorService {

    private final BuildErrorRepository buildErrorRepository;

    public BuildErrorService(BuildErrorRepository buildErrorRepository) {
        this.buildErrorRepository = buildErrorRepository;
    }

    public List<BuildError> findRecent(Severity severity) {
        if (severity != null) {
            return buildErrorRepository.findBySeverityOrderByCreatedAtDesc(severity);
        }
        return buildErrorRepository.findTop100ByOrderByCreatedAtDesc();
    }
}
