package com.startupsync.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private String id;
    private String title;
    private String message;
    private String notificationType;
    private String relatedEntityId;
    private String relatedEntityType;
    private Boolean isRead;
    private LocalDateTime readAt;
    private LocalDateTime createdAt;
}
