package com.startupsync.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationResponse {

    private String id;
    private ApplicantDTO applicant;
    private StartupDTO startup;
    private String status;
    private String coverLetter;
    private LocalDateTime appliedAt;
    private LocalDateTime reviewedAt;
    private String rejectionReason;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicantDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String profilePhotoUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StartupDTO {
        private String id;
        private String name;
        private String industry;
        private String logoUrl;
    }
}
