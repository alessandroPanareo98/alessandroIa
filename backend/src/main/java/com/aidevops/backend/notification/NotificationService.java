package com.aidevops.backend.notification;

import com.aidevops.backend.error.BuildError;
import com.aidevops.backend.error.Severity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> findLatest() {
        return notificationRepository.findTop100ByOrderByCreatedAtDesc();
    }

    public List<Notification> findUnread() {
        return notificationRepository.findByReadFlagFalseOrderByCreatedAtDesc();
    }

    @Transactional
    public Notification createForError(BuildError error) {
        Notification notification = new Notification();
        notification.setError(error);
        notification.setChannel(NotificationChannel.DASHBOARD);
        notification.setMessage("Nuovo errore " + error.getSeverity() + ": " + error.getTitle());
        return notificationRepository.save(notification);
    }

    @Transactional
    public void markRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
        notification.setReadFlag(true);
        notificationRepository.save(notification);
    }

    public boolean shouldNotify(Severity severity) {
        return severity == Severity.HIGH || severity == Severity.CRITICAL;
    }
}
