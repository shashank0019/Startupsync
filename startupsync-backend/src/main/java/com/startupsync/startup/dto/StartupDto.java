package com.startupsync.startup.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StartupDto {
    private UUID id;
    private String name;
    private String logoUrl;
    private String tagline;
    private String description;
    private String industry;
    private String fundingStage;
    private String location;
    private boolean isRemote;
    private List<String> requiredSkills;
}