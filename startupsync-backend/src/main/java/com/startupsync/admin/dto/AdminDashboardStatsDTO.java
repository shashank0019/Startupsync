package com.startupsync.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDTO {

    private Long totalUsers;

    private Long totalStartups;

    private Long totalApplications;

    private Long totalTeams;

    private Long activeUsers;

    private Double userGrowthRate;

    private Double startupGrowthRate;

    private Integer averageTeamSize;
}
