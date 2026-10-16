package com.startupsync.task.entity;

import com.startupsync.auth.entity.User;
import com.startupsync.startup.entity.Startup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tasks", indexes = {
        @Index(name = "idx_task_startup_id", columnList = "startup_id"),
        @Index(name = "idx_task_assigned_to", columnList = "assigned_to"),
        @Index(name = "idx_task_status", columnList = "status"),
        @Index(name = "idx_task_created_by", columnList = "created_by")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private Startup startup;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "status", nullable = false, length = 50)
    private String status; // TODO, IN_PROGRESS, REVIEW, COMPLETED

    @Column(name = "priority", nullable = false, length = 50)
    private String priority; // LOW, MEDIUM, HIGH, URGENT

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "completion_percentage", nullable = false)
    private Integer completionPercentage;

    @Column(name = "sprint_name", length = 100)
    private String sprintName;

    @Column(name = "created_by", nullable = false, length = 36)
    private String createdBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.status == null) {
            this.status = "TODO";
        }
        if (this.priority == null) {
            this.priority = "MEDIUM";
        }
        if (this.completionPercentage == null) {
            this.completionPercentage = 0;
        }
    }
}
