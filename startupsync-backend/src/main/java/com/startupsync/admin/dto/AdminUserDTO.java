package com.startupsync.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminUserDTO {

    private String id;

    private String firstName;

    private String lastName;

    private String email;

    private String role;

    private Boolean isActive;

    private Boolean isEmailVerified;

    private String profilePhotoUrl;

    private String location;

    private String availabilityStatus;

    private Integer profileCompletionPercentage;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime deletedAt;

    public AdminUserDTO(String id, String firstName, String lastName, String email, String role, Boolean isActive, Boolean isEmailVerified, String profilePhotoUrl, String location, String availabilityStatus, Integer profileCompletionPercentage, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime deletedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
        this.isEmailVerified = isEmailVerified;
        this.profilePhotoUrl = profilePhotoUrl;
        this.location = location;
        this.availabilityStatus = availabilityStatus;
        this.profileCompletionPercentage = profileCompletionPercentage;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt;
    }

    public static AdminUserDTOBuilder builder() {
        return new AdminUserDTOBuilder();
    }

    public static class AdminUserDTOBuilder {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String role;
        private Boolean isActive;
        private Boolean isEmailVerified;
        private String profilePhotoUrl;
        private String location;
        private String availabilityStatus;
        private Integer profileCompletionPercentage;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private LocalDateTime deletedAt;

        AdminUserDTOBuilder() {}

        public AdminUserDTOBuilder id(String id) {
            this.id = id;
            return this;
        }

        public AdminUserDTOBuilder firstName(String firstName) {
            this.firstName = firstName;
            return this;
        }

        public AdminUserDTOBuilder lastName(String lastName) {
            this.lastName = lastName;
            return this;
        }

        public AdminUserDTOBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AdminUserDTOBuilder role(String role) {
            this.role = role;
            return this;
        }

        public AdminUserDTOBuilder isActive(Boolean isActive) {
            this.isActive = isActive;
            return this;
        }

        public AdminUserDTOBuilder isEmailVerified(Boolean isEmailVerified) {
            this.isEmailVerified = isEmailVerified;
            return this;
        }

        public AdminUserDTOBuilder profilePhotoUrl(String profilePhotoUrl) {
            this.profilePhotoUrl = profilePhotoUrl;
            return this;
        }

        public AdminUserDTOBuilder location(String location) {
            this.location = location;
            return this;
        }

        public AdminUserDTOBuilder availabilityStatus(String availabilityStatus) {
            this.availabilityStatus = availabilityStatus;
            return this;
        }

        public AdminUserDTOBuilder profileCompletionPercentage(Integer profileCompletionPercentage) {
            this.profileCompletionPercentage = profileCompletionPercentage;
            return this;
        }

        public AdminUserDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public AdminUserDTOBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public AdminUserDTOBuilder deletedAt(LocalDateTime deletedAt) {
            this.deletedAt = deletedAt;
            return this;
        }

        public AdminUserDTO build() {
            return new AdminUserDTO(id, firstName, lastName, email, role, isActive, isEmailVerified, profilePhotoUrl, location, availabilityStatus, profileCompletionPercentage, createdAt, updatedAt, deletedAt);
        }
    }
}
