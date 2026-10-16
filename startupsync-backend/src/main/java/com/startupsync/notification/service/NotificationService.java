package com.startupsync.notification.service;

import com.startupsync.notification.dto.CreateNotificationRequest;
import com.startupsync.notification.dto.NotificationDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    /**
     * Create and send notification
     */
    NotificationDTO createNotification(CreateNotificationRequest request);

    /**
     * Create and send notification (internal)
     */
    NotificationDTO createNotification(String userId, String title, String message, String type, String entityId, String entityType);

    /**
     * Get all notifications for user
     */
    Page<NotificationDTO> getNotifications(String userId, Pageable pageable);

    /**
     * Get unread notifications for user
     */
    Page<NotificationDTO> getUnreadNotifications(String userId, Pageable pageable);

    /**
     * Mark notification as read
     */
    NotificationDTO markAsRead(String notificationId);

    /**
     * Mark all notifications as read
     */
    void markAllAsRead(String userId);

    /**
     * Delete notification
     */
    void deleteNotification(String notificationId);

    /**
     * Count unread notifications
     */
    long countUnreadNotifications(String userId);

    /**
     * Get notifications by type
     */
    List<NotificationDTO> getNotificationsByType(String userId, String type);
}
