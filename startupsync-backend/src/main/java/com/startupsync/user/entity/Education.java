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
public class Education {

    @Column(name = "edu_school_name", length = 150)
    private String schoolName;

    @Column(name = "edu_degree", length = 100)
    private String degree;

    @Column(name = "edu_field_of_study", length = 100)
    private String fieldOfStudy;

    @Column(name = "edu_start_date")
    private LocalDate startDate;

    @Column(name = "edu_end_date")
    private LocalDate endDate;

    @Column(name = "edu_grade", length = 10)
    private String grade;

    @Column(name = "edu_description", columnDefinition = "TEXT", length = 500)
    private String description;
}
