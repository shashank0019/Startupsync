package com.startupsync.invitation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationResponse {

    private String id;
    private StartupDTO startup;
    private InvitedUserDTO invitedUser;
    private InvitedByDTO invitedBy;
    private String status;
    private String message;
    private String position;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;

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

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InvitedUserDTO {
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
    public static class InvitedByDTO {
        private String id;
        private String firstName;
        private String lastName;
    }
}
