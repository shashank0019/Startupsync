package com.startupsync.activity.service;

import com.startupsync.activity.dto.ActivityResponse;
import com.startupsync.activity.entity.ActivityEvent;
import com.startupsync.activity.repository.ActivityRepository;
import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.notification.entity.Notification;
import com.startupsync.notification.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@Transactional
public class ActivityServiceImpl implements ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Page<ActivityResponse> getMyActivities(String userId, Pageable pageable, String filter) {
        if (activityRepository.countByUserId(userId) == 0) {
            backfillFromNotifications(userId);
        }
        
        if (filter != null && !filter.isEmpty() && !filter.equals("ALL")) {
            return activityRepository.findByUserIdAndActivityType(userId, filter, pageable).map(this::toResponse);
        }
        
        return activityRepository.findByUserId(userId, pageable).map(this::toResponse);
    }

    @Override
    public Page<ActivityResponse> getStartupActivities(String startupId, Pageable pageable, String filter) {
        if (filter != null && !filter.isEmpty() && !filter.equals("ALL")) {
            return activityRepository.findByEntityTypeAndEntityIdAndActivityType("STARTUP", startupId, filter, pageable).map(this::toResponse);
        }
        
        return activityRepository.findByEntityTypeAndEntityId("STARTUP", startupId, pageable).map(this::toResponse);
    }

    @Override
    public ActivityResponse recordActivity(String userId, String title, String description,
                                           String activityType, String entityType, String entityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        ActivityEvent event = ActivityEvent.builder()
                .user(user)
                .title(title)
                .description(description)
                .activityType(activityType)
                .entityType(entityType)
                .entityId(entityId)
                .build();

        return toResponse(activityRepository.save(event));
    }

    private void backfillFromNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findAllByUserId(userId);
        User user = userRepository.findById(userId).orElse(null);
        if (user == null || notifications.isEmpty()) {
            return;
        }

        notifications.stream().limit(20).forEach(n -> {
            ActivityEvent event = ActivityEvent.builder()
                    .user(user)
                    .title(n.getTitle())
                    .description(n.getMessage())
                    .activityType(n.getNotificationType())
                    .entityType(n.getRelatedEntityType())
                    .entityId(n.getRelatedEntityId())
                    .build();
            activityRepository.save(event);
        });
        log.info("Backfilled {} activity events for user {}", Math.min(notifications.size(), 20), userId);
    }

    private ActivityResponse toResponse(ActivityEvent event) {
        return ActivityResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .activityType(event.getActivityType())
                .entityType(event.getEntityType())
                .entityId(event.getEntityId())
                .createdAt(event.getCreatedAt())
                .build();
    }
}
