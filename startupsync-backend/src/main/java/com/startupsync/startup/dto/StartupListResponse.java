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
public class StartupListResponse {

    private String id;

    private String name;

    private String tagline;

    private String logoUrl;

    private String founderName;

    private String industry;

    private String fundingStage;

    private String status;

    private Integer teamSizeNeeded;

    private String location;

    private Boolean isRemote;

    private Integer viewCount;

    private Integer applicationCount;

    private LocalDateTime createdAt;
}
