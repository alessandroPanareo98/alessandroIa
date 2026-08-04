package com.aidevops.backend.pipeline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PipelineRepository extends JpaRepository<Pipeline, Long> {
    Optional<Pipeline> findByGitlabPipelineId(Long gitlabPipelineId);

    List<Pipeline> findByProjectIdOrderByStartedAtDesc(Long projectId);

    List<Pipeline> findByStatusOrderByStartedAtDesc(PipelineStatus status);
}
