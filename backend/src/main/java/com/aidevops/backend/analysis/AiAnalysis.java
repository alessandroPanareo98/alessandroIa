package com.aidevops.backend.analysis;

import com.aidevops.backend.error.BuildError;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "ai_analyses")
public class AiAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "error_id", nullable = false, unique = true)
    private BuildError error;

    @Column(nullable = false, length = 30)
    private String severity;

    @Column(nullable = false, length = 2000)
    private String cause;

    @Column(nullable = false, length = 3000)
    private String solution;

    @Column(nullable = false)
    private double confidence;

    @Column(nullable = false, length = 5000)
    private String rawResponse;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
