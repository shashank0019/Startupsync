package com.startupsync.notification.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.notification.dto.CreateNotificationRequest;
import com.startupsync.notification.dto.NotificationDTO;
import com.startupsync.notification.entity.Notification;
import com.startupsync.notification.repository.NotificationRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Override
    public NotificationDTO createNotification(CreateNotificationRequest request) {
        log.info("Creating notification for user: {}", request.getUserId());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        Notification notification = Notification.builder()
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .notificationType(request.getNotificationType())
                .relatedEntityId(request.getRelatedEntityId())
                .relatedEntityType(request.getRelatedEntityType())
                .isRead(false)
                .build();

        notification = notificationRepository.save(notification);
        log.info("Notification created: {}", notification.getId());

        NotificationDTO dto = mapToNotificationDTO(notification);

        // Send real-time notification via WebSocket
        sendRealTimeNotification(request.getUserId(), dto);

        return dto;
    }

    @Override
    public NotificationDTO createNotification(String userId, String title, String message, String type, String entityId, String entityType) {
        log.info("Creating notification for user: {} - type: {}", userId, type);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .notificationType(type)
                .relatedEntityId(entityId)
                .relatedEntityType(entityType)
                .isRead(false)
                .build();

        notification = notificationRepository.save(notification);
        log.info("Notification created: {}", notification.getId());

        NotificationDTO dto = mapToNotificationDTO(notification);

        // Send real-time notification
        sendRealTimeNotification(userId, dto);

        return dto;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getNotifications(String userId, Pageable pageable) {
        log.debug("Fetching notifications for user: {}", userId);

        return notificationRepository.findByUserId(userId, pageable)
                .map(this::mapToNotificationDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getUnreadNotifications(String userId, Pageable pageable) {
        log.debug("Fetching unread notifications for user: {}", userId);

        return notificationRepository.findUnreadByUserId(userId, pageable)
                .map(this::mapToNotificationDTO);
    }

    @Override
    public NotificationDTO markAsRead(String notificationId) {
        log.info("Marking notification as read: {}", notificationId);

        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());

        notification = notificationRepository.save(notification);
        log.info("Notification marked as read: {}", notificationId);

        return mapToNotificationDTO(notification);
    }

    @Override
    public void markAllAsRead(String userId) {
        log.info("Marking all notifications as read for user: {}", userId);

        List<Notification> unreadNotifications = notificationRepository.findAllByUserId(userId)
                .stream()
                .filter(n -> !n.getIsRead())
                .collect(Collectors.toList());

        LocalDateTime now = LocalDateTime.now();
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
            notification.setReadAt(now);
        }

        notificationRepository.saveAll(unreadNotifications);
        log.info("All notifications marked as read for user: {}", userId);
    }

    @Override
    public void deleteNotification(String notificationId) {
        log.info("Deleting notification: {}", notificationId);

        notificationRepository.deleteById(notificationId);

        log.info("Notification deleted: {}", notificationId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadNotifications(String userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getNotificationsByType(String userId, String type) {
        log.debug("Fetching notifications for user: {} with type: {}", userId, type);

        return notificationRepository.findByUserIdAndType(userId, type)
                .stream()
                .map(this::mapToNotificationDTO)
                .collect(Collectors.toList());
    }

    private void sendRealTimeNotification(String userId, NotificationDTO notification) {
        try {
            messagingTemplate.convertAndSendToUser(
                    userId,
                    "/queue/notifications",
                    notification
            );
            log.debug("Real-time notification sent to user: {}", userId);
        } catch (Exception e) {
            log.warn("Failed to send real-time notification: {}", e.getMessage());
        }
    }

    private NotificationDTO mapToNotificationDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .message(notification.getMessage())
                .notificationType(notification.getNotificationType())
                .relatedEntityId(notification.getRelatedEntityId())
                .relatedEntityType(notification.getRelatedEntityType())
                .isRead(notification.getIsRead())
                .readAt(notification.getReadAt())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
