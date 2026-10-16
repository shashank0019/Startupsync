package com.startupsync.admin.controller;

import com.startupsync.admin.dto.AdminDashboardStatsDTO;
import com.startupsync.admin.service.AdminDashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
@Slf4j
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    /**
     * Get comprehensive dashboard statistics
     * GET /admin/dashboard/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<AdminDashboardStatsDTO> getDashboardStats() {
        log.info("Admin dashboard stats endpoint called");

        try {
            AdminDashboardStatsDTO stats = adminDashboardService.getDashboardStats();
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total users count
     * GET /admin/dashboard/users/total
     */
    @GetMapping("/users/total")
    public ResponseEntity<Long> getTotalUsers() {
        log.info("Get total users endpoint called");

        try {
            Long totalUsers = adminDashboardService.getTotalUsersCount();
            return ResponseEntity.ok(totalUsers);

        } catch (Exception e) {
            log.error("Error fetching total users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total startups count
     * GET /admin/dashboard/startups/total
     */
    @GetMapping("/startups/total")
    public ResponseEntity<Long> getTotalStartups() {
        log.info("Get total startups endpoint called");

        try {
            Long totalStartups = adminDashboardService.getTotalStartupsCount();
            return ResponseEntity.ok(totalStartups);

        } catch (Exception e) {
            log.error("Error fetching total startups", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total applications count
     * GET /admin/dashboard/applications/total
     */
    @GetMapping("/applications/total")
    public ResponseEntity<Long> getTotalApplications() {
        log.info("Get total applications endpoint called");

        try {
            Long totalApplications = adminDashboardService.getTotalApplicationsCount();
            return ResponseEntity.ok(totalApplications);

        } catch (Exception e) {
            log.error("Error fetching total applications", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get total teams count
     * GET /admin/dashboard/teams/total
     */
    @GetMapping("/teams/total")
    public ResponseEntity<Long> getTotalTeams() {
        log.info("Get total teams endpoint called");

        try {
            Long totalTeams = adminDashboardService.getTotalTeamsCount();
            return ResponseEntity.ok(totalTeams);

        } catch (Exception e) {
            log.error("Error fetching total teams", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
