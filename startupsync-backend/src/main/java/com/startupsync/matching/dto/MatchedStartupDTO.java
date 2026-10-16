package com.startupsync.matching.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchedStartupDTO {

    private String startupId;
    private String name;
    private String logoUrl;
    private String tagline;
    private String description;
    private String industry;
    private String fundingStage;
    private String location;
    private Boolean isRemote;
    private Integer teamSizeNeeded;
    private List<String> requiredSkills;

    private Double skillsMatchPercentage;
    private Double experienceMatchPercentage;
    private Double industryMatchPercentage;
    private Double locationMatchPercentage;
    private Double availabilityMatchPercentage;
    private Double overallMatchPercentage;

    private List<String> matchingSkills;
    private List<String> skillsMissing;

    private String founderName;
    private String founderEmail;
}
