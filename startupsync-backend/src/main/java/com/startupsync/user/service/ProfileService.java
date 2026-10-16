package com.startupsync.user.service;

import com.startupsync.user.dto.ProfileResponse;
import com.startupsync.user.dto.ProfileUpdateRequest;

public interface ProfileService {

    /**
     * Get user profile by user ID
     * @param userId the user ID
     * @return ProfileResponse with all profile details
     */
    ProfileResponse getProfile(String userId);

    /**
     * Create user profile
     * @param userId the user ID
     * @param createRequest the profile creation details
     * @return created ProfileResponse
     */
    ProfileResponse createProfile(String userId, ProfileUpdateRequest createRequest);

    /**
     * Update user profile
     * @param userId the user ID
     * @param updateRequest the profile update details
     * @return updated ProfileResponse
     */
    ProfileResponse updateProfile(String userId, ProfileUpdateRequest updateRequest);

    /**
     * Delete user profile
     * @param userId the user ID
     */
    void deleteProfile(String userId);

    /**
     * Calculate profile completion percentage
     * @param userId the user ID
     * @return completion percentage (0-100)
     */
    int calculateCompletionPercentage(String userId);

    /**
     * Update profile picture URL
     * @param userId the user ID
     * @param picturUrl the picture URL from cloud storage
     * @return updated ProfileResponse
     */
    ProfileResponse updateProfilePicture(String userId, String picturUrl);

    /**
     * Upload and save a user profile photo
     */
    String uploadProfilePhoto(String userId, org.springframework.web.multipart.MultipartFile file);
}
