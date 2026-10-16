package com.startupsync.matching.controller;

import com.startupsync.matching.dto.MatchedCandidateDTO;
import com.startupsync.matching.dto.MatchedStartupDTO;
import com.startupsync.matching.service.MatchingService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/matching")
@Slf4j
public class MatchingController {

    @Autowired
    private MatchingService matchingService;

    @GetMapping("/startup/{startupId}")
    public ResponseEntity<Page<MatchedCandidateDTO>> getMatchedCandidates(
            @PathVariable String startupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get matched candidates endpoint called for startup: {}", startupId);

        Pageable pageable = PageRequest.of(page, size);
        Page<MatchedCandidateDTO> matchedCandidates = matchingService.getMatchedCandidates(startupId, pageable);

        return ResponseEntity.ok(matchedCandidates);
    }

    @GetMapping("/startup/{startupId}/top")
    public ResponseEntity<List<MatchedCandidateDTO>> getTopMatchedCandidates(
            @PathVariable String startupId,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get top matched candidates endpoint called for startup: {} with limit: {}", startupId, limit);

        List<MatchedCandidateDTO> topCandidates = matchingService.getTopMatchedCandidates(startupId, limit);

        return ResponseEntity.ok(topCandidates);
    }

    @GetMapping("/score/{startupId}/{userId}")
    public ResponseEntity<Double> getCompatibilityScore(
            @PathVariable String startupId,
            @PathVariable String userId) {

        log.info("Get compatibility score for user: {} and startup: {}", userId, startupId);

        Double score = matchingService.calculateCompatibilityScore(userId, startupId);

        return ResponseEntity.ok(score);
    }

    @GetMapping("/startups")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MatchedStartupDTO>> getRecommendedStartups(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {

        log.info("Get recommended startups endpoint called for user: {} with limit: {}", authentication.getName(), limit);

        String userId = authentication.getName();
        List<MatchedStartupDTO> recommendedStartups = matchingService.getRecommendedStartups(userId, limit);

        return ResponseEntity.ok(recommendedStartups);
    }

    @GetMapping("/compatibility/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MatchedStartupDTO> getCompatibilityBreakdown(
            @PathVariable String startupId,
            Authentication authentication) {

        log.info("Get compatibility breakdown for user: {} and startup: {}", authentication.getName(), startupId);

        String userId = authentication.getName();
        MatchedStartupDTO compatibility = matchingService.getCompatibilityBreakdown(userId, startupId);

        return ResponseEntity.ok(compatibility);
    }
}
