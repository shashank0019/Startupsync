package com.startupsync.admin.service;

import com.startupsync.admin.dto.AdminDashboardStatsDTO;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.application.repository.ApplicationRepository;
import com.startupsync.team.repository.TeamRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
@Transactional(readOnly = true)
public class AdminDashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private TeamRepository teamRepository;

    /**
     * Get comprehensive dashboard statistics
     */
    public AdminDashboardStatsDTO getDashboardStats() {
        log.info("Fetching admin dashboard statistics");

        try {
            Long totalUsers = userRepository.count();
            Long totalStartups = startupRepository.count();
            Long totalApplications = applicationRepository.count();
            Long totalTeams = teamRepository.count();
            Long activeUsers = getActiveUsersCount();

            Double userGrowthRate = calculateUserGrowthRate();
            Double startupGrowthRate = calculateStartupGrowthRate();
            Integer averageTeamSize = calculateAverageTeamSize();

            return AdminDashboardStatsDTO.builder()
                    .totalUsers(totalUsers)
                    .totalStartups(totalStartups)
                    .totalApplications(totalApplications)
                    .totalTeams(totalTeams)
                    .activeUsers(activeUsers)
                    .userGrowthRate(userGrowthRate)
                    .startupGrowthRate(startupGrowthRate)
                    .averageTeamSize(averageTeamSize)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching dashboard statistics", e);
            throw new RuntimeException("Failed to fetch dashboard statistics");
        }
    }

    /**
     * Get total active users (users who are active and not deleted)
     */
    private Long getActiveUsersCount() {
        // Count users where isActive = true and deletedAt is null
        return userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && user.getDeletedAt() == null)
                .count();
    }

    /**
     * Calculate user growth rate (last 30 days vs previous 30 days)
     */
    private Double calculateUserGrowthRate() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        LocalDateTime sixtyDaysAgo = now.minusDays(60);

        long recentUsers = userRepository.findAll().stream()
                .filter(user -> user.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();

        long previousUsers = userRepository.findAll().stream()
                .filter(user -> user.getCreatedAt().isBefore(thirtyDaysAgo) && user.getCreatedAt().isAfter(sixtyDaysAgo))
                .count();

        if (previousUsers == 0) {
            return recentUsers > 0 ? 100.0 : 0.0;
        }

        return ((double) (recentUsers - previousUsers) / previousUsers) * 100;
    }

    /**
     * Calculate startup growth rate (last 30 days vs previous 30 days)
     */
    private Double calculateStartupGrowthRate() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime thirtyDaysAgo = now.minusDays(30);
        LocalDateTime sixtyDaysAgo = now.minusDays(60);

        long recentStartups = startupRepository.findAll().stream()
                .filter(startup -> startup.getCreatedAt().isAfter(thirtyDaysAgo))
                .count();

        long previousStartups = startupRepository.findAll().stream()
                .filter(startup -> startup.getCreatedAt().isBefore(thirtyDaysAgo) && startup.getCreatedAt().isAfter(sixtyDaysAgo))
                .count();

        if (previousStartups == 0) {
            return recentStartups > 0 ? 100.0 : 0.0;
        }

        return ((double) (recentStartups - previousStartups) / previousStartups) * 100;
    }

    /**
     * Calculate average team size
     */
    private Integer calculateAverageTeamSize() {
        long totalTeams = teamRepository.count();
        if (totalTeams == 0) {
            return 0;
        }

        long totalMembers = teamRepository.findAll().stream()
                .mapToLong(team -> (long) team.getMembers().size())
                .sum();

        return (int) (totalMembers / totalTeams);
    }

    /**
     * Get total users count
     */
    public Long getTotalUsersCount() {
        return userRepository.count();
    }

    /**
     * Get total startups count
     */
    public Long getTotalStartupsCount() {
        return startupRepository.count();
    }

    /**
     * Get total applications count
     */
    public Long getTotalApplicationsCount() {
        return applicationRepository.count();
    }

    /**
     * Get total teams count
     */
    public Long getTotalTeamsCount() {
        return teamRepository.count();
    }
}
