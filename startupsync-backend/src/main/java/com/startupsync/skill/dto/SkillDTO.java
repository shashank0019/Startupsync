package com.startupsync.skill.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDTO {

    private String id;

    private String name;

    private String description;

    private String category;

    private Integer endorsementCount;

    private Boolean isVerified;

    private LocalDateTime createdAt;
}
