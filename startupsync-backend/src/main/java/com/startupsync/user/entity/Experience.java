package com.startupsync.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Experience {

    @Column(name = "exp_company_name", length = 150)
    private String companyName;

    @Column(name = "exp_job_title", length = 150)
    private String jobTitle;

    @Column(name = "exp_employment_type", length = 50)
    private String employmentType;

    @Column(name = "exp_location", length = 100)
    private String location;

    @Column(name = "exp_start_date")
    private LocalDate startDate;

    @Column(name = "exp_end_date")
    private LocalDate endDate;

    @Column(name = "exp_is_current")
    private Boolean isCurrent;

    @Column(name = "exp_description", columnDefinition = "TEXT", length = 500)
    private String description;
}
