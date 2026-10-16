package com.startupsync.invitation.entity;

import com.startupsync.auth.entity.User;
import com.startupsync.startup.entity.Startup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "invitations", indexes = {
        @Index(name = "idx_invitation_invited_user_id", columnList = "invited_user_id"),
        @Index(name = "idx_invitation_startup_id", columnList = "startup_id"),
        @Index(name = "idx_invitation_status", columnList = "status"),
        @Index(name = "idx_invitation_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invitation {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private Startup startup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_user_id", nullable = false)
    private User invitedUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invited_by_id", nullable = false)
    private User invitedBy;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // PENDING, ACCEPTED, REJECTED

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "position", length = 100)
    private String position;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
