package com.aidevops.backend.project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByGitlabProjectId(Long gitlabProjectId);
}
