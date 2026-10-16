package com.startupsync.user.entity;

import com.startupsync.auth.entity.User;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
@Entity
@Table(name = "user_profiles", indexes = {
        @Index(name = "idx_profile_user_id", columnList = "user_id", unique = true),
        @Index(name = "idx_profile_completion", columnList = "completion_percentage")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "user_id", nullable = false, foreignKey = @ForeignKey(name = "fk_profile_user"))
    private User user;

    @Column(name = "bio", columnDefinition = "TEXT", length = 1000)
    private String bio;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "location", length = 100)
    private String location;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "github_url", length = 255)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 255)
    private String linkedinUrl;

    @Column(name = "portfolio_url", length = 255)
    private String portfolioUrl;

    @Column(name = "website_url", length = 255)
    private String websiteUrl;

    @Column(name = "twitter_url", length = 255)
    private String twitterUrl;

    @Column(name = "profile_picture_url", length = 500)
    private String profilePictureUrl;

    @Column(name = "years_of_experience")
    private Integer yearsOfExperience;

    @Column(name = "current_job_title", length = 150)
    private String currentJobTitle;

    @Column(name = "current_company", length = 150)
    private String currentCompany;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_experiences", joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "experience_order")
    @Builder.Default
    private List<Experience> experiences = new ArrayList<>();

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "user_educations", joinColumns = @JoinColumn(name = "profile_id"))
    @OrderColumn(name = "education_order")
    @Builder.Default
    private List<Education> educations = new ArrayList<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "user_skills",
        joinColumns = @JoinColumn(name = "profile_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private List<com.startupsync.skill.entity.Skill> skills = new ArrayList<>();

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "completion_percentage")
    @Builder.Default
    private Integer completionPercentage = 0;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @Column(name = "visibility", length = 20)
    @Builder.Default
    private String visibility = "PUBLIC";

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;
}
