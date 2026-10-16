package com.startupsync.notification.controller;

import com.startupsync.notification.dto.CreateNotificationRequest;
import com.startupsync.notification.dto.NotificationDTO;
import com.startupsync.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@Slf4j
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<NotificationDTO>> getNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get notifications endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDTO> notifications = notificationService.getNotifications(userId, pageable);

        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<NotificationDTO>> getUnreadNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get unread notifications endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<NotificationDTO> notifications = notificationService.getUnreadNotifications(userId, pageable);

        return ResponseEntity.ok(notifications);
    }

    @GetMapping({"/unread/count", "/unread-count"})
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getUnreadCount(Authentication authentication) {

        log.info("Get unread count endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        long count = notificationService.countUnreadNotifications(userId);

        return ResponseEntity.ok(count);
    }

    @GetMapping("/type/{type}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByType(
            @PathVariable String type,
            Authentication authentication) {

        log.info("Get notifications by type endpoint called - Type: {}", type);

        String userId = authentication.getName();
        List<NotificationDTO> notifications = notificationService.getNotificationsByType(userId, type);

        return ResponseEntity.ok(notifications);
    }

    @RequestMapping(value = "/{notificationId}/read", method = {RequestMethod.PATCH, RequestMethod.PUT})
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable String notificationId) {

        log.info("Mark notification as read endpoint called - ID: {}", notificationId);

        NotificationDTO notification = notificationService.markAsRead(notificationId);

        return ResponseEntity.ok(notification);
    }

    @RequestMapping(value = {"/mark-all-read", "/read-all"}, method = {RequestMethod.PATCH, RequestMethod.PUT})
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAllAsRead(Authentication authentication) {

        log.info("Mark all as read endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        notificationService.markAllAsRead(userId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{notificationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNotification(@PathVariable String notificationId) {

        log.info("Delete notification endpoint called - ID: {}", notificationId);

        notificationService.deleteNotification(notificationId);

        return ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationDTO> createNotification(@Valid @RequestBody CreateNotificationRequest request) {

        log.info("Create notification endpoint called for user: {}", request.getUserId());

        NotificationDTO notification = notificationService.createNotification(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(notification);
    }
}
