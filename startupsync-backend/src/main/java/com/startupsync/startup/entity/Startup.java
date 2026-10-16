package com.startupsync.startup.entity;

import jakarta.persistence.*;
import lombok.*;
import com.startupsync.auth.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "startups")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    private String logoUrl;
    private String tagline;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String industry;

    private String fundingStage;
    private String location;
    private boolean isRemote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "founder_id", nullable = false)
    private User founder;

    private int teamSize;
    private int teamSizeNeeded;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "startup_skills",
        joinColumns = @JoinColumn(name = "startup_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private List<com.startupsync.skill.entity.Skill> skills = new java.util.ArrayList<>();

    @Column(name = "mission", columnDefinition = "TEXT")
    private String mission;

    @Column(name = "vision", columnDefinition = "TEXT")
    private String vision;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "startup_required_skills", joinColumns = @JoinColumn(name = "startup_id"))
    private List<String> requiredSkills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "startup_required_skill_ids", joinColumns = @JoinColumn(name = "startup_id"))
    private List<String> requiredSkillIds;

    private String status;
    private String visibility;
    private Integer viewCount;
    private Integer applicationCount;
    private String websiteUrl;
    private String createdBy;
    private String updatedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public String getId() { return this.id; }
    public String getName() { return this.name; }
    public User getFounder() { return this.founder; }
    public String getStatus() { return this.status; }
    public Integer getViewCount() { return this.viewCount; }
    public Integer getApplicationCount() { return this.applicationCount; }
}