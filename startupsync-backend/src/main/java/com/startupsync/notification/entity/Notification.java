package com.startupsync.notification.entity;

import com.startupsync.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "notifications", indexes = {
        @Index(name = "idx_notification_user_id", columnList = "user_id"),
        @Index(name = "idx_notification_is_read", columnList = "is_read"),
        @Index(name = "idx_notification_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "notification_type", nullable = false, length = 50)
    private String notificationType; // APPLICATION, INVITATION, MESSAGE, TASK, SYSTEM

    @Column(name = "related_entity_id", length = 36)
    private String relatedEntityId;

    @Column(name = "related_entity_type", length = 50)
    private String relatedEntityType; // STARTUP, APPLICATION, INVITATION, TASK, USER

    @Column(name = "is_read", nullable = false)
    private Boolean isRead;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.isRead == null) {
            this.isRead = false;
        }
    }
}
