package com.startupsync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProfileResponse {

    private String id;

    private UserBasicDTO user;

    private String bio;

    private String headline;

    private String location;

    private String phoneNumber;

    private String githubUrl;

    private String linkedinUrl;

    private String portfolioUrl;

    private String websiteUrl;

    private String twitterUrl;

    private String profilePictureUrl;

    private String availabilityStatus;

    private Integer yearsOfExperience;

    private String currentJobTitle;

    private String currentCompany;

    private List<ExperienceDTO> experiences;

    private List<EducationDTO> educations;

    private Integer completionPercentage;

    private Boolean isVerified;

    private String visibility;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserBasicDTO {

        private String id;

        private String firstName;

        private String lastName;

        private String email;

        private String role;
    }
}
