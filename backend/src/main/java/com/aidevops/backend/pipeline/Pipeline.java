package com.aidevops.backend.pipeline;

import com.aidevops.backend.project.Project;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "pipelines")
public class Pipeline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, unique = true)
    private Long gitlabPipelineId;

    @Column(nullable = false, length = 120)
    private String refName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PipelineStatus status;

    @Column(nullable = false)
    private OffsetDateTime startedAt = OffsetDateTime.now();

    private OffsetDateTime finishedAt;
}
