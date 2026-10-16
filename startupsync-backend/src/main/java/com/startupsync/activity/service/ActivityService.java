package com.startupsync.activity.service;

import com.startupsync.activity.dto.ActivityResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ActivityService {
    Page<ActivityResponse> getMyActivities(String userId, Pageable pageable, String filter);

    Page<ActivityResponse> getStartupActivities(String startupId, Pageable pageable, String filter);

    ActivityResponse recordActivity(String userId, String title, String description,
                                    String activityType, String entityType, String entityId);
}
