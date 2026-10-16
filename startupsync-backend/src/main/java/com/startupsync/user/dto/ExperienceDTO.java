package com.startupsync.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExperienceDTO {

    private String companyName;

    private String jobTitle;

    private String employmentType;

    private String location;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isCurrent;

    private String description;
}
