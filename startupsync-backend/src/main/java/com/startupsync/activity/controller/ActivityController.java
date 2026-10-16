package com.startupsync.activity.controller;

import com.startupsync.activity.dto.ActivityResponse;
import com.startupsync.activity.service.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/activities")
@Slf4j
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ActivityResponse>> getMyActivities(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String filter) {

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(activityService.getMyActivities(userId, pageable, filter));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ActivityResponse>> getUserActivities(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String filter) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(activityService.getMyActivities(userId, pageable, filter));
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ActivityResponse>> getStartupActivities(
            @PathVariable String startupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String filter) {

        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(activityService.getStartupActivities(startupId, pageable, filter));
    }
}
