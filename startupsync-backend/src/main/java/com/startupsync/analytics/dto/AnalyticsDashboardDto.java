package com.startupsync.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsDashboardDto {
    private long totalApplications;
    private long totalMatches;
    private long unreadMessages;
    private long teamMemberCount;
    private long profileViews;
    private double responseRate;
    private List<MetricSeriesDto> series;

    private long activeStartups;
    private long pendingInvitations;
    private long pendingTasks;
    private long startupViews;
}
