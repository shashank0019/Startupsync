package com.startupsync.analytics.service;

import com.startupsync.analytics.dto.AnalyticsDashboardDto;

public interface AnalyticsService {
    AnalyticsDashboardDto getDashboard(String userId);
}
