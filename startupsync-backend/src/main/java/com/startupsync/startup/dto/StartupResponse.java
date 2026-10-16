package com.startupsync.startup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupResponse {

    private String id;

    private String name;

    private String description;

    private String tagline;

    private String logoUrl;

    private FounderDTO founder;

    private String industry;

    private String fundingStage;

    private String status;

    private Integer teamSizeNeeded;

    private String location;

    private String websiteUrl;

    private Boolean isRemote;

    private Set<String> requiredSkillIds;

    private String visibility;

    private Integer viewCount;

    private Integer applicationCount;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private String mission;

    private String vision;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FounderDTO {

        private String id;

        private String firstName;

        private String lastName;

        private String email;

        private String profilePhotoUrl;
    }
}
