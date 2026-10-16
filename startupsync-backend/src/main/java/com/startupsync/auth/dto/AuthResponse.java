package com.startupsync.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    private String refreshToken;

    private String tokenType;

    private Long expiresIn;

    private UserDTO user;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {

        private String id;

        private String firstName;

        private String lastName;

        private String email;

        private String role;

        private Boolean isEmailVerified;

        private Boolean isActive;

        private String profilePhotoUrl;

        private Integer profileCompletionPercentage;
    }
}
