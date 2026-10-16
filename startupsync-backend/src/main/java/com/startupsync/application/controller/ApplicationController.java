package com.startupsync.application.controller;

import com.startupsync.application.dto.ApplicationRequest;
import com.startupsync.application.dto.ApplicationResponse;
import com.startupsync.application.dto.ApplicationReviewRequest;
import com.startupsync.application.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("/applications")
public class ApplicationController {

    private static final Logger log = LoggerFactory.getLogger(ApplicationController.class);

    @Autowired
    private ApplicationService applicationService;

    @PostMapping("/apply/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationResponse> applyToStartup(
            @PathVariable String startupId,
            Authentication authentication,
            @Valid @RequestBody ApplicationRequest request) {

        log.info("Apply to startup endpoint called for startup: {} by user: {}", startupId, authentication.getName());

        String userId = authentication.getName();
        ApplicationResponse response = applicationService.applyToStartup(userId, startupId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> withdrawApplication(
            @PathVariable String applicationId,
            Authentication authentication) {

        log.info("Withdraw application endpoint called - ID: {} by user: {}", applicationId, authentication.getName());

        String userId = authentication.getName();
        applicationService.withdrawApplication(userId, applicationId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ApplicationResponse>> getMyApplications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get my applications endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationResponse> applications = applicationService.getApplicationsByUser(userId, pageable);

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ApplicationResponse>> getStartupApplications(
            @PathVariable String startupId,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get startup applications endpoint called - Startup: {} by user: {}", startupId, authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<ApplicationResponse> applications = applicationService.getApplicationsByStartup(startupId, userId, pageable);

        return ResponseEntity.ok(applications);
    }

    @GetMapping("/{applicationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationResponse> getApplication(@PathVariable String applicationId) {

        log.info("Get application endpoint called - ID: {}", applicationId);

        ApplicationResponse application = applicationService.getApplication(applicationId);

        return ResponseEntity.ok(application);
    }

    @PatchMapping("/{applicationId}/review")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationResponse> reviewApplication(
            @PathVariable String applicationId,
            Authentication authentication) {

        log.info("Review application endpoint called - ID: {} by user: {}", applicationId, authentication.getName());

        String userId = authentication.getName();
        ApplicationResponse response = applicationService.reviewApplication(applicationId, userId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{applicationId}/approve")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationResponse> approveApplication(
            @PathVariable String applicationId,
            Authentication authentication,
            @Valid @RequestBody ApplicationReviewRequest request) {

        log.info("Approve application endpoint called - ID: {} by user: {}", applicationId, authentication.getName());

        String userId = authentication.getName();
        ApplicationResponse response = applicationService.approveApplication(applicationId, userId, request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{applicationId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationResponse> rejectApplication(
            @PathVariable String applicationId,
            Authentication authentication,
            @Valid @RequestBody ApplicationReviewRequest request) {

        log.info("Reject application endpoint called - ID: {} by user: {}", applicationId, authentication.getName());

        String userId = authentication.getName();
        ApplicationResponse response = applicationService.rejectApplication(applicationId, userId, request);

        return ResponseEntity.ok(response);
    }
}
