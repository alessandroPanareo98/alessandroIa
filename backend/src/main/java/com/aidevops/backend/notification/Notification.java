package com.aidevops.backend.notification;

import com.aidevops.backend.error.BuildError;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "error_id")
    private BuildError error;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private NotificationChannel channel;

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(nullable = false)
    private boolean readFlag = false;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
