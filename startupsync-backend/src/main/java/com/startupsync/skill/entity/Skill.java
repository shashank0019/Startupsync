package com.startupsync.skill.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "skills", indexes = {
        @Index(name = "idx_skill_name", columnList = "name"),
        @Index(name = "idx_skill_category", columnList = "category")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @NotBlank(message = "Skill name is required")
    @Column(name = "name", nullable = false, unique = true, length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT", length = 500)
    private String description;

    @NotBlank(message = "Skill category is required")
    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "endorsement_count")
    @Builder.Default
    private Integer endorsementCount = 0;

    @Column(name = "is_verified")
    @Builder.Default
    private Boolean isVerified = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Override
    public String toString() {
        return "Skill{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", endorsementCount=" + endorsementCount +
                '}';
    }
}
