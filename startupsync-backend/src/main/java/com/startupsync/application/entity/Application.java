package com.startupsync.application.entity;

import com.startupsync.auth.entity.User;
import com.startupsync.startup.entity.Startup;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "applications", indexes = {
        @Index(name = "idx_application_applicant_id", columnList = "applicant_id"),
        @Index(name = "idx_application_startup_id", columnList = "startup_id"),
        @Index(name = "idx_application_status", columnList = "status"),
        @Index(name = "idx_application_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "startup_id", nullable = false)
    private Startup startup;

    @Column(name = "status", nullable = false, length = 20)
    private String status; // PENDING, ACCEPTED, REJECTED

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "applied_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime appliedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by", length = 36)
    private String reviewedBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

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

    public String getId() { return this.id; }
    public User getApplicant() { return this.applicant; }
    public Startup getStartup() { return this.startup; }
    public String getStatus() { return this.status; }
    public String getCoverLetter() { return this.coverLetter; }
    public void setStatus(String status) { this.status = status; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }
    public static ApplicationBuilder builder() {
        return new ApplicationBuilder();
    }

    public static class ApplicationBuilder {
        private String id;
        private User applicant;
        private Startup startup;
        private String status;
        private String coverLetter;
        private LocalDateTime appliedAt;
        private LocalDateTime reviewedAt;
        private String reviewedBy;
        private String rejectionReason;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        ApplicationBuilder() {}

        public ApplicationBuilder id(String id) {
            this.id = id;
            return this;
        }

        public ApplicationBuilder applicant(User applicant) {
            this.applicant = applicant;
            return this;
        }

        public ApplicationBuilder startup(Startup startup) {
            this.startup = startup;
            return this;
        }

        public ApplicationBuilder status(String status) {
            this.status = status;
            return this;
        }

        public ApplicationBuilder coverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
            return this;
        }

        public ApplicationBuilder appliedAt(LocalDateTime appliedAt) {
            this.appliedAt = appliedAt;
            return this;
        }

        public ApplicationBuilder reviewedAt(LocalDateTime reviewedAt) {
            this.reviewedAt = reviewedAt;
            return this;
        }

        public ApplicationBuilder reviewedBy(String reviewedBy) {
            this.reviewedBy = reviewedBy;
            return this;
        }

        public ApplicationBuilder rejectionReason(String rejectionReason) {
            this.rejectionReason = rejectionReason;
            return this;
        }

        public ApplicationBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public ApplicationBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public Application build() {
            return new Application(id, applicant, startup, status, coverLetter, appliedAt, reviewedAt, reviewedBy, rejectionReason, createdAt, updatedAt);
        }
    }
}
