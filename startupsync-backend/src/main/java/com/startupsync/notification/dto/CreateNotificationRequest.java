package com.startupsync.notification.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateNotificationRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Message is required")
    private String message;

    @NotBlank(message = "Notification type is required")
    private String notificationType;

    private String relatedEntityId;
    private String relatedEntityType;
}
