package com.startupsync.team.entity;

import com.startupsync.auth.entity.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "team_members", indexes = {
        @Index(name = "idx_team_member_team_id", columnList = "team_id"),
        @Index(name = "idx_team_member_user_id", columnList = "user_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMember {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    @ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    @lombok.EqualsAndHashCode.Exclude
    private User user;

    @Column(name = "role", nullable = false, length = 50)
    private String role; // FOUNDER, LEAD, MEMBER

    @Column(name = "position", length = 100)
    private String position;

    @Column(name = "joined_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime joinedAt;

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
        if (this.role == null) {
            this.role = "MEMBER";
        }
    }
}
