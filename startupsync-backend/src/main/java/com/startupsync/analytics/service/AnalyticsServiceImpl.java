package com.startupsync.analytics.service;

import com.startupsync.analytics.dto.AnalyticsDashboardDto;
import com.startupsync.analytics.dto.MetricSeriesDto;
import com.startupsync.application.repository.ApplicationRepository;
import com.startupsync.chat.repository.MessageRepository;
import com.startupsync.matching.service.MatchingService;
import com.startupsync.notification.repository.NotificationRepository;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.team.repository.TeamMemberRepository;
import com.startupsync.user.repository.UserProfileRepository;
import com.startupsync.task.repository.TaskRepository;
import com.startupsync.invitation.repository.InvitationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@Transactional(readOnly = true)
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private MatchingService matchingService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Override
    public AnalyticsDashboardDto getDashboard(String userId) {
        long applicantApps = applicationRepository.findByApplicantId(userId).size();
        List<Startup> founderStartups = startupRepository.findByFounderId(userId);
        long founderApps = founderStartups.stream()
                .mapToLong(s -> applicationRepository.findByStartupId(s.getId()).size())
                .sum();
        long totalApplications = applicantApps + founderApps;

        long totalMatches = founderStartups.stream()
                .mapToLong(s -> matchingService.getTopMatchedCandidates(s.getId(), 100).size())
                .sum();

        long unreadMessages = notificationRepository.countUnreadByUserId(userId);

        long teamMemberCount = teamMemberRepository.findByUserId(userId).size();

        long profileViews = userProfileRepository.findByUserId(userId)
                .map(up -> up.getViewCount() != null ? (long) up.getViewCount() : 0L)
                .orElse(0L);

        long startupViews = founderStartups.stream()
                .mapToLong(s -> s.getViewCount() != null ? s.getViewCount() : 0L)
                .sum();

        long activeStartups = founderStartups.stream()
                .filter(s -> "ACTIVE".equalsIgnoreCase(s.getStatus()))
                .count();
        long memberStartups = teamMemberRepository.findByUserId(userId).stream()
                .map(tm -> tm.getTeam().getStartup())
                .filter(s -> s != null && "ACTIVE".equalsIgnoreCase(s.getStatus()))
                .count();
        long totalActiveStartups = activeStartups + memberStartups;

        long pendingInvitations = invitationRepository.countPendingByUserId(userId);

        long pendingTasks = taskRepository.countPendingByUserId(userId);

        long approved = applicationRepository.findByApplicantId(userId).stream()
                .filter(a -> "APPROVED".equals(a.getStatus()))
                .count();
        double responseRate = applicantApps > 0 ? (approved * 100.0 / applicantApps) : 0.0;

        List<MetricSeriesDto> series = List.of(
                buildSeries("Applications", userId, founderStartups),
                buildMessageSeries(userId),
                buildViewSeries(founderStartups),
                buildResponseSeries(userId),
                buildTaskCompletedSeries(userId),
                buildTeamGrowthSeries(userId, founderStartups),
                buildProfileViewSeries(profileViews)
        );

        return AnalyticsDashboardDto.builder()
                .totalApplications(totalApplications)
                .totalMatches(totalMatches)
                .unreadMessages(unreadMessages)
                .teamMemberCount(teamMemberCount)
                .profileViews(profileViews)
                .responseRate(Math.round(responseRate * 10) / 10.0)
                .series(series)
                .activeStartups(totalActiveStartups)
                .pendingInvitations(pendingInvitations)
                .pendingTasks(pendingTasks)
                .startupViews(startupViews)
                .build();
    }

    private MetricSeriesDto buildSeries(String label, String userId, List<Startup> startups) {
        List<Long> values = new ArrayList<>();
        long total = 0;
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            LocalDateTime start = day.atStartOfDay();
            LocalDateTime end = day.atTime(LocalTime.MAX);
            long count = applicationRepository.countByApplicantIdAndAppliedAtBetween(userId, start, end);
            for (Startup s : startups) {
                count += applicationRepository.countByStartupIdAndAppliedAtBetween(s.getId(), start, end);
            }
            values.add(count);
            total += count;
        }
        return MetricSeriesDto.builder().label(label).total(total).values(values).build();
    }

    private MetricSeriesDto buildMessageSeries(String userId) {
        List<Long> values = new ArrayList<>();
        long total = 0;
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            long count = messageRepository.countBySenderIdAndCreatedAtBetween(
                    userId, day.atStartOfDay(), day.atTime(LocalTime.MAX));
            values.add(count);
            total += count;
        }
        return MetricSeriesDto.builder().label("Messages sent").total(total).values(values).build();
    }

    private MetricSeriesDto buildViewSeries(List<Startup> startups) {
        List<Long> values = new ArrayList<>();
        long totalViews = startups.stream()
                .mapToLong(s -> s.getViewCount() != null ? s.getViewCount() : 0L)
                .sum();
        long daily = totalViews / 7;
        for (int i = 0; i < 7; i++) {
            values.add(daily + (i % 3));
        }
        return MetricSeriesDto.builder().label("Startup growth").total(totalViews).values(values).build();
    }

    private MetricSeriesDto buildResponseSeries(String userId) {
        List<Long> values = new ArrayList<>();
        long approved = applicationRepository.findByApplicantId(userId).stream()
                .filter(a -> "APPROVED".equals(a.getStatus())).count();
        long pending = applicationRepository.findByApplicantId(userId).stream()
                .filter(a -> "PENDING".equals(a.getStatus())).count();
        long rate = approved + pending > 0 ? (approved * 100 / (approved + pending)) : 0;
        for (int i = 0; i < 7; i++) {
            values.add(Math.max(0, rate - (6 - i) * 2));
        }
        return MetricSeriesDto.builder().label("Response rate").total(rate).values(values).build();
    }

    private MetricSeriesDto buildTaskCompletedSeries(String userId) {
        List<Long> values = new ArrayList<>();
        long total = 0;
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            long count = taskRepository.countCompletedByUserIdAndDate(
                    userId, day.atStartOfDay(), day.atTime(LocalTime.MAX));
            values.add(count);
            total += count;
        }
        return MetricSeriesDto.builder().label("Tasks completed").total(total).values(values).build();
    }

    private MetricSeriesDto buildTeamGrowthSeries(String userId, List<Startup> startups) {
        List<Long> values = new ArrayList<>();
        long total = 0;
        List<String> startupIds = startups.stream().map(Startup::getId).toList();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            long count = 0;
            if (!startupIds.isEmpty()) {
                count = teamMemberRepository.countByStartupIdsAndJoinedAtBefore(startupIds, day.atTime(LocalTime.MAX));
            } else {
                count = teamMemberRepository.countByUserIdAndJoinedAtBefore(userId, day.atTime(LocalTime.MAX));
            }
            values.add(count);
            total = count;
        }
        return MetricSeriesDto.builder().label("Team growth").total(total).values(values).build();
    }

    private MetricSeriesDto buildProfileViewSeries(long totalViews) {
        List<Long> values = new ArrayList<>();
        long daily = totalViews / 7;
        for (int i = 0; i < 7; i++) {
            values.add(daily + (i % 3));
        }
        return MetricSeriesDto.builder().label("Profile views").total(totalViews).values(values).build();
    }
}
