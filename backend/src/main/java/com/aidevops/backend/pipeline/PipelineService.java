package com.aidevops.backend.pipeline;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PipelineService {

    private final PipelineRepository pipelineRepository;

    public PipelineService(PipelineRepository pipelineRepository) {
        this.pipelineRepository = pipelineRepository;
    }

    public List<Pipeline> findAll(Long projectId, PipelineStatus status) {
        if (projectId != null) {
            return pipelineRepository.findByProjectIdOrderByStartedAtDesc(projectId);
        }
        if (status != null) {
            return pipelineRepository.findByStatusOrderByStartedAtDesc(status);
        }
        return pipelineRepository.findAll();
    }
}
