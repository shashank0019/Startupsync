package com.startupsync.startup.controller;

import com.startupsync.startup.dto.StartupDto;
import com.startupsync.startup.dto.StartupResponse;
import com.startupsync.startup.service.StartupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/startups")
@RequiredArgsConstructor
public class StartupController {

    private final StartupService startupService;

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<java.util.List<StartupResponse>> getMyStartups(Authentication authentication) {
        String userId = authentication.getName();
        return ResponseEntity.ok(startupService.getStartupsByFounderId(userId));
    }

    @GetMapping
    public ResponseEntity<Page<StartupDto>> getStartups(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String fundingStage,
            @RequestParam(required = false) Boolean isRemote,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
            
        Page<StartupDto> startups = startupService.searchAndFilterStartups(
                search, industry, fundingStage, isRemote, PageRequest.of(page, size));
        return ResponseEntity.ok(startups);
    }

    @GetMapping("/recommended")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<StartupDto>> getRecommendedStartups(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        String userId = authentication.getName();
        Page<StartupDto> startups = startupService.getRecommendedStartups(userId, PageRequest.of(page, size));
        return ResponseEntity.ok(startups);
    }

    @GetMapping("/trending")
    public ResponseEntity<Page<StartupDto>> getTrendingStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        
        Page<StartupDto> startups = startupService.getTrendingStartups(PageRequest.of(page, size));
        return ResponseEntity.ok(startups);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupResponse> getStartupById(@PathVariable String id) {
        return ResponseEntity.ok(startupService.getStartupById(id));
    }

    @PostMapping
    public ResponseEntity<StartupResponse> createStartup(
            @RequestAttribute("userId") String userId,
            @RequestBody com.startupsync.startup.dto.StartupCreateRequest request) {
        return ResponseEntity.ok(startupService.createStartup(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StartupResponse> updateStartup(
            @PathVariable String id,
            @RequestAttribute("userId") String userId,
            @RequestBody com.startupsync.startup.dto.StartupCreateRequest request) {
        return ResponseEntity.ok(startupService.updateStartup(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStartup(
            @PathVariable String id,
            @RequestAttribute("userId") String userId) {
        startupService.deleteStartup(id, userId);
        return ResponseEntity.noContent().build();
    }
}