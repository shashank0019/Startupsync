package com.startupsync.startup.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupCreateRequest {

    @NotBlank(message = "Startup name is required")
    @Size(min = 3, max = 200, message = "Startup name must be between 3 and 200 characters")
    private String name;

    private String logoUrl;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Size(max = 500, message = "Tagline must not exceed 500 characters")
    private String tagline;

    @Size(max = 2000, message = "Mission must not exceed 2000 characters")
    private String mission;

    @Size(max = 2000, message = "Vision must not exceed 2000 characters")
    private String vision;

    @NotBlank(message = "Industry is required")
    @Size(min = 2, max = 100, message = "Industry must be between 2 and 100 characters")
    private String industry;

    @Size(max = 50, message = "Funding stage must not exceed 50 characters")
    private String fundingStage;

    private String status;

    @Min(value = 1, message = "Team size needed must be at least 1")
    private Integer teamSizeNeeded;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    private Boolean isRemote;

    @Size(max = 500, message = "Website URL must not exceed 500 characters")
    private String websiteUrl;

    private Set<String> requiredSkillIds;

    @Size(max = 50, message = "Visibility must be PUBLIC or PRIVATE")
    private String visibility;
}
