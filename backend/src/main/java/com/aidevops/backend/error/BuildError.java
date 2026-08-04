package com.aidevops.backend.error;

import com.aidevops.backend.pipeline.Job;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "build_errors")
public class BuildError {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Severity severity;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, length = 4000)
    private String details;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
