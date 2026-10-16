package com.startupsync.analytics.controller;

import com.startupsync.analytics.dto.AnalyticsDashboardDto;
import com.startupsync.analytics.service.AnalyticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/analytics")
@Slf4j
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AnalyticsDashboardDto> getDashboard(Authentication authentication) {
        return ResponseEntity.ok(analyticsService.getDashboard(authentication.getName()));
    }
}
