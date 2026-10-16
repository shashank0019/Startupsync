package com.startupsync.matching.service;

import com.startupsync.matching.dto.MatchedCandidateDTO;
import com.startupsync.matching.dto.MatchedStartupDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface MatchingService {

    /**
     * Get matched candidates for a startup
     */
    Page<MatchedCandidateDTO> getMatchedCandidates(String startupId, Pageable pageable);

    /**
     * Get top N matched candidates
     */
    List<MatchedCandidateDTO> getTopMatchedCandidates(String startupId, int limit);

    /**
     * Calculate compatibility score for a user against a startup
     */
    Double calculateCompatibilityScore(String userId, String startupId);

    /**
     * Calculate skills match percentage
     */
    Double calculateSkillsMatch(String userId, String startupId);

    /**
     * Calculate experience match percentage
     */
    Double calculateExperienceMatch(String userId, String startupId);

    /**
     * Calculate industry match percentage
     */
    Double calculateIndustryMatch(String userId, String startupId);

    /**
     * Calculate location match percentage
     */
    Double calculateLocationMatch(String userId, String startupId);

    /**
     * Calculate availability match percentage
     */
    Double calculateAvailabilityMatch(String userId, String startupId);

    /**
     * Get recommended startups for a user
     */
    List<MatchedStartupDTO> getRecommendedStartups(String userId, int limit);

    /**
     * Get compatibility breakdown for a user against a startup
     */
    MatchedStartupDTO getCompatibilityBreakdown(String userId, String startupId);
}
