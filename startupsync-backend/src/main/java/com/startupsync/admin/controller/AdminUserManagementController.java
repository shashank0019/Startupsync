package com.startupsync.admin.controller;

import com.startupsync.admin.dto.AdminUserDTO;
import com.startupsync.admin.dto.UserActionRequest;
import com.startupsync.admin.dto.UserActionResponse;
import com.startupsync.admin.dto.UserListResponse;
import com.startupsync.admin.service.AdminUserManagementService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserManagementController {

    private static final Logger log = LoggerFactory.getLogger(AdminUserManagementController.class);

    @Autowired
    private AdminUserManagementService adminUserManagementService;

    /**
     * Get all users with pagination
     * GET /admin/users?pageNumber=0&pageSize=10
     */
    @GetMapping
    public ResponseEntity<UserListResponse> getAllUsers(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("Get all users endpoint called - Page: {}, Size: {}", pageNumber, pageSize);

        try {
            UserListResponse response = adminUserManagementService.getAllUsers(pageNumber, pageSize);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching all users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get user by ID
     * GET /admin/users/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserDTO> getUserById(@PathVariable String userId) {
        log.info("Get user by ID endpoint called - User ID: {}", userId);

        try {
            AdminUserDTO user = adminUserManagementService.getUserById(userId);
            return ResponseEntity.ok(user);

        } catch (Exception e) {
            log.error("Error fetching user by ID", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    /**
     * Suspend user account
     * POST /admin/users/suspend
     */
    @PostMapping("/suspend")
    public ResponseEntity<UserActionResponse> suspendUser(@Valid @RequestBody UserActionRequest request) {
        log.info("Suspend user endpoint called - User ID: {}", request.getUserId());

        try {
            adminUserManagementService.suspendUser(request.getUserId(), request.getReason());

            UserActionResponse response = UserActionResponse.builder()
                    .userId(request.getUserId())
                    .message("User account has been suspended successfully")
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error suspending user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UserActionResponse.builder()
                            .userId(request.getUserId())
                            .message("Failed to suspend user")
                            .status("FAILED")
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    /**
     * Activate user account
     * POST /admin/users/activate
     */
    @PostMapping("/activate")
    public ResponseEntity<UserActionResponse> activateUser(@Valid @RequestBody UserActionRequest request) {
        log.info("Activate user endpoint called - User ID: {}", request.getUserId());

        try {
            adminUserManagementService.activateUser(request.getUserId());

            UserActionResponse response = UserActionResponse.builder()
                    .userId(request.getUserId())
                    .message("User account has been activated successfully")
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error activating user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UserActionResponse.builder()
                            .userId(request.getUserId())
                            .message("Failed to activate user")
                            .status("FAILED")
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    /**
     * Delete user account
     * POST /admin/users/delete
     */
    @PostMapping("/delete")
    public ResponseEntity<UserActionResponse> deleteUser(@Valid @RequestBody UserActionRequest request) {
        log.info("Delete user endpoint called - User ID: {}", request.getUserId());

        try {
            adminUserManagementService.deleteUser(request.getUserId(), request.getReason());

            UserActionResponse response = UserActionResponse.builder()
                    .userId(request.getUserId())
                    .message("User account has been deleted successfully")
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error deleting user", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UserActionResponse.builder()
                            .userId(request.getUserId())
                            .message("Failed to delete user")
                            .status("FAILED")
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    /**
     * Search users by email
     * GET /admin/users/search?email=example&pageNumber=0&pageSize=10
     */
    @GetMapping("/search")
    public ResponseEntity<UserListResponse> searchUsersByEmail(
            @RequestParam String email,
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("Search users by email endpoint called - Email: {}", email);

        try {
            UserListResponse response = adminUserManagementService.searchUsersByEmail(email, pageNumber, pageSize);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error searching users by email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get inactive users
     * GET /admin/users/status/inactive?pageNumber=0&pageSize=10
     */
    @GetMapping("/status/inactive")
    public ResponseEntity<UserListResponse> getInactiveUsers(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("Get inactive users endpoint called - Page: {}, Size: {}", pageNumber, pageSize);

        try {
            UserListResponse response = adminUserManagementService.getInactiveUsers(pageNumber, pageSize);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching inactive users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Get deleted users
     * GET /admin/users/status/deleted?pageNumber=0&pageSize=10
     */
    @GetMapping("/status/deleted")
    public ResponseEntity<UserListResponse> getDeletedUsers(
            @RequestParam(defaultValue = "0") Integer pageNumber,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("Get deleted users endpoint called - Page: {}, Size: {}", pageNumber, pageSize);

        try {
            UserListResponse response = adminUserManagementService.getDeletedUsers(pageNumber, pageSize);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error fetching deleted users", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Verify user email
     * POST /admin/users/{userId}/verify-email
     */
    @PostMapping("/{userId}/verify-email")
    public ResponseEntity<UserActionResponse> verifyUserEmail(@PathVariable String userId) {
        log.info("Verify user email endpoint called - User ID: {}", userId);

        try {
            adminUserManagementService.verifyUserEmail(userId);

            UserActionResponse response = UserActionResponse.builder()
                    .userId(userId)
                    .message("User email has been verified successfully")
                    .status("SUCCESS")
                    .timestamp(LocalDateTime.now())
                    .build();

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Error verifying user email", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(UserActionResponse.builder()
                            .userId(userId)
                            .message("Failed to verify user email")
                            .status("FAILED")
                            .timestamp(LocalDateTime.now())
                            .build());
        }
    }

    /**
     * Get user statistics
     * GET /admin/users/stats/summary
     */
    @GetMapping("/stats/summary")
    public ResponseEntity<?> getUserStatistics() {
        log.info("Get user statistics endpoint called");

        try {
            return ResponseEntity.ok().body(new Object() {
                public final Long totalUsers = adminUserManagementService.getTotalUsersCount();
                public final Long activeUsers = adminUserManagementService.getActiveUsersCount();
                public final Long inactiveUsers = adminUserManagementService.getInactiveUsersCount();
                public final Long deletedUsers = adminUserManagementService.getDeletedUsersCount();
            });

        } catch (Exception e) {
            log.error("Error fetching user statistics", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
