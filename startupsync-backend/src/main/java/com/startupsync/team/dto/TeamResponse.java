package com.startupsync.team.dto;

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
public class TeamResponse {

    private String id;
    private String name;
    private String description;
    private Integer memberCount;
    private List<TeamMemberDTO> members;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TeamMemberDTO {
        private String id;
        private String userId;
        private String firstName;
        private String lastName;
        private String email;
        private String profilePhotoUrl;
        private String role;
        private String position;
        private LocalDateTime joinedAt;
    }
}
