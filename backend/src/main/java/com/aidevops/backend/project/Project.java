package com.aidevops.backend.project;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long gitlabProjectId;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(nullable = false, length = 300)
    private String path;

    @Column(nullable = false, length = 300)
    private String webUrl;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
