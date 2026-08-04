package com.aidevops.backend.error;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildErrorRepository extends JpaRepository<BuildError, Long> {
    List<BuildError> findBySeverityOrderByCreatedAtDesc(Severity severity);

    List<BuildError> findTop100ByOrderByCreatedAtDesc();
}
