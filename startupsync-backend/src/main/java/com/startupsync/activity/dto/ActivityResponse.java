package com.startupsync.activity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityResponse {
    private String id;
    private String title;
    private String description;
    private String activityType;
    private String entityType;
    private String entityId;
    private LocalDateTime createdAt;
}
