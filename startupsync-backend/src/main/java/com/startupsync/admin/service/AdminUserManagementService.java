package com.startupsync.admin.service;

import com.startupsync.admin.dto.AdminUserDTO;
import com.startupsync.admin.dto.UserListResponse;
import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class AdminUserManagementService {

    private static final Logger log = LoggerFactory.getLogger(AdminUserManagementService.class);

    @Autowired
    private UserRepository userRepository;

    /**
     * Get paginated list of all users
     */
    public UserListResponse getAllUsers(Integer pageNumber, Integer pageSize) {
        log.info("Fetching all users - Page: {}, Size: {}", pageNumber, pageSize);

        try {
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<User> users = userRepository.findAll(pageable);

            List<AdminUserDTO> userDTOs = users.getContent().stream()
                    .map(this::convertToAdminUserDTO)
                    .collect(Collectors.toList());

            return UserListResponse.builder()
                    .users(userDTOs)
                    .totalCount((int) users.getTotalElements())
                    .pageNumber(pageNumber)
                    .pageSize(pageSize)
                    .totalPages(users.getTotalPages())
                    .hasNext(users.hasNext())
                    .hasPrevious(users.hasPrevious())
                    .build();

        } catch (Exception e) {
            log.error("Error fetching users", e);
            throw new RuntimeException("Failed to fetch users");
        }
    }

    /**
     * Get user by ID
     */
    public AdminUserDTO getUserById(String userId) {
        log.info("Fetching user by ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        return convertToAdminUserDTO(user);
    }

    /**
     * Suspend user account
     */
    public void suspendUser(String userId, String reason) {
        log.info("Suspending user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User suspended successfully. Reason: {}", reason);
    }

    /**
     * Activate suspended user account
     */
    public void activateUser(String userId) {
        log.info("Activating user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User activated successfully");
    }

    /**
     * Delete user account (soft delete)
     */
    public void deleteUser(String userId, String reason) {
        log.info("Deleting user with ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setDeletedAt(LocalDateTime.now());
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User deleted successfully. Reason: {}", reason);
    }

    /**
     * Search users by email
     */
    public UserListResponse searchUsersByEmail(String email, Integer pageNumber, Integer pageSize) {
        log.info("Searching users by email: {}", email);

        try {
            Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));

            List<User> users = userRepository.findAll().stream()
                    .filter(u -> u.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .skip((long) pageNumber * pageSize)
                    .limit(pageSize)
                    .collect(Collectors.toList());

            List<AdminUserDTO> userDTOs = users.stream()
                    .map(this::convertToAdminUserDTO)
                    .collect(Collectors.toList());

            long totalCount = userRepository.findAll().stream()
                    .filter(u -> u.getEmail().toLowerCase().contains(email.toLowerCase()))
                    .count();

            return UserListResponse.builder()
                    .users(userDTOs)
                    .totalCount((int) totalCount)
                    .pageNumber(pageNumber)
                    .pageSize(pageSize)
                    .totalPages((int) Math.ceil((double) totalCount / pageSize))
                    .hasNext((pageNumber + 1) * pageSize < totalCount)
                    .hasPrevious(pageNumber > 0)
                    .build();

        } catch (Exception e) {
            log.error("Error searching users by email", e);
            throw new RuntimeException("Failed to search users");
        }
    }

    /**
     * Get inactive users
     */
    public UserListResponse getInactiveUsers(Integer pageNumber, Integer pageSize) {
        log.info("Fetching inactive users - Page: {}, Size: {}", pageNumber, pageSize);

        try {
            List<User> inactiveUsers = userRepository.findAll().stream()
                    .filter(u -> !u.getIsActive() && u.getDeletedAt() == null)
                    .skip((long) pageNumber * pageSize)
                    .limit(pageSize)
                    .collect(Collectors.toList());

            List<AdminUserDTO> userDTOs = inactiveUsers.stream()
                    .map(this::convertToAdminUserDTO)
                    .collect(Collectors.toList());

            long totalCount = userRepository.findAll().stream()
                    .filter(u -> !u.getIsActive() && u.getDeletedAt() == null)
                    .count();

            return UserListResponse.builder()
                    .users(userDTOs)
                    .totalCount((int) totalCount)
                    .pageNumber(pageNumber)
                    .pageSize(pageSize)
                    .totalPages((int) Math.ceil((double) totalCount / pageSize))
                    .hasNext((pageNumber + 1) * pageSize < totalCount)
                    .hasPrevious(pageNumber > 0)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching inactive users", e);
            throw new RuntimeException("Failed to fetch inactive users");
        }
    }

    /**
     * Get deleted users
     */
    public UserListResponse getDeletedUsers(Integer pageNumber, Integer pageSize) {
        log.info("Fetching deleted users - Page: {}, Size: {}", pageNumber, pageSize);

        try {
            List<User> deletedUsers = userRepository.findAll().stream()
                    .filter(u -> u.getDeletedAt() != null)
                    .skip((long) pageNumber * pageSize)
                    .limit(pageSize)
                    .collect(Collectors.toList());

            List<AdminUserDTO> userDTOs = deletedUsers.stream()
                    .map(this::convertToAdminUserDTO)
                    .collect(Collectors.toList());

            long totalCount = userRepository.findAll().stream()
                    .filter(u -> u.getDeletedAt() != null)
                    .count();

            return UserListResponse.builder()
                    .users(userDTOs)
                    .totalCount((int) totalCount)
                    .pageNumber(pageNumber)
                    .pageSize(pageSize)
                    .totalPages((int) Math.ceil((double) totalCount / pageSize))
                    .hasNext((pageNumber + 1) * pageSize < totalCount)
                    .hasPrevious(pageNumber > 0)
                    .build();

        } catch (Exception e) {
            log.error("Error fetching deleted users", e);
            throw new RuntimeException("Failed to fetch deleted users");
        }
    }

    /**
     * Verify user email
     */
    public void verifyUserEmail(String userId) {
        log.info("Verifying user email for user ID: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        user.setIsEmailVerified(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("User email verified successfully");
    }

    /**
     * Convert User entity to AdminUserDTO
     */
    private AdminUserDTO convertToAdminUserDTO(User user) {
        return AdminUserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().getName() : "USER")
                .isActive(user.getIsActive())
                .isEmailVerified(user.getIsEmailVerified())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .location(user.getUserProfile() != null ? user.getUserProfile().getLocation() : null)
                .availabilityStatus(user.getAvailabilityStatus())
                .profileCompletionPercentage(user.getProfileCompletionPercentage())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .deletedAt(user.getDeletedAt())
                .build();
    }

    /**
     * Get total users count
     */
    public Long getTotalUsersCount() {
        return userRepository.count();
    }

    /**
     * Get active users count
     */
    public Long getActiveUsersCount() {
        return userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && user.getDeletedAt() == null)
                .count();
    }

    /**
     * Get inactive users count
     */
    public Long getInactiveUsersCount() {
        return userRepository.findAll().stream()
                .filter(user -> !user.getIsActive() && user.getDeletedAt() == null)
                .count();
    }

    /**
     * Get deleted users count
     */
    public Long getDeletedUsersCount() {
        return userRepository.findAll().stream()
                .filter(user -> user.getDeletedAt() != null)
                .count();
    }
}
