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
public class MatchedCandidateDTO {

    private String userId;
    private String firstName;
    private String lastName;
    private String email;
    private String profilePhotoUrl;
    private String headline;
    private String location;

    private Double skillsMatchPercentage;
    private Double experienceMatchPercentage;
    private Double industryMatchPercentage;
    private Double locationMatchPercentage;

    private Double overallMatchPercentage;
    private Integer matchRanking;

    private List<String> matchingSkills;
    private List<String> requiredSkillsMissing;

    private Integer yearsOfExperience;
    private String bio;
    private String profileCompletionPercentage;
}
