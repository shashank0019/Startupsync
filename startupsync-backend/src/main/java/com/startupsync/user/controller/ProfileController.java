package com.startupsync.user.controller;

import com.startupsync.user.dto.ProfileResponse;
import com.startupsync.user.dto.ProfileUpdateRequest;
import com.startupsync.user.service.ProfileService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/profile")
@Slf4j
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        log.info("Get profile endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        ProfileResponse profileResponse = profileService.getProfile(userId);

        return ResponseEntity.ok(profileResponse);
    }

    @GetMapping("/completion")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Integer> getCompletionPercentage(Authentication authentication) {
        log.info("Get completion percentage endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        int completionPercentage = profileService.calculateCompletionPercentage(userId);

        return ResponseEntity.ok(completionPercentage);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileResponse> getUserProfile(@PathVariable String userId) {
        log.info("Get user profile endpoint called for user: {}", userId);

        ProfileResponse profileResponse = profileService.getProfile(userId);

        return ResponseEntity.ok(profileResponse);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileResponse> createProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest createRequest) {

        log.info("Create profile endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        ProfileResponse profileResponse = profileService.createProfile(userId, createRequest);

        return ResponseEntity.ok(profileResponse);
    }

    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteProfile(Authentication authentication) {

        log.info("Delete profile endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        profileService.deleteProfile(userId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest updateRequest) {

        log.info("Update profile endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        ProfileResponse profileResponse = profileService.updateProfile(userId, updateRequest);

        return ResponseEntity.ok(profileResponse);
    }

    @PostMapping(value = "/upload-photo", consumes = "multipart/form-data")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> uploadProfilePhoto(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        log.info("Upload profile photo endpoint called for user: {}", authentication.getName());
        String userId = authentication.getName();
        String photoUrl = profileService.uploadProfilePhoto(userId, file);

        Map<String, String> response = new HashMap<>();
        response.put("profilePhotoUrl", photoUrl);
        return ResponseEntity.ok(response);
    }
}
