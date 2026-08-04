package com.aidevops.backend.pipeline;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long> {
    Optional<Job> findByGitlabJobId(Long gitlabJobId);

    List<Job> findByPipelineIdOrderByCreatedAtDesc(Long pipelineId);
}
