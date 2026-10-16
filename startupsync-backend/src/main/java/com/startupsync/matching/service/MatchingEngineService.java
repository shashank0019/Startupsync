package com.startupsync.matching.service;

import com.startupsync.user.entity.UserProfile;
import com.startupsync.startup.entity.Startup;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MatchingEngineService {

    /**
     * Calculates compatibility score based on formula:
     * 40% Skills | 20% Experience | 15% Industry | 15% Availability | 10% Location
     */
    public int calculateCompatibilityScore(UserProfile profile, Startup startup) {
        return 0;
    }

    private double calculateListMatch(List<String> profileList, List<String> targetList) {
        if (targetList == null || targetList.isEmpty()) return 100.0; // No requirements = 100% match
        if (profileList == null || profileList.isEmpty()) return 0.0;
        
        long matchCount = targetList.stream()
                .filter(req -> profileList.stream().anyMatch(prof -> prof.equalsIgnoreCase(req)))
                .count();
        return ((double) matchCount / targetList.size()) * 100.0;
    }

    private double calculateKeywordMatch(List<String> keywords, String targetText) {
        if (keywords == null || keywords.isEmpty() || targetText == null) return 0.0;
        String lowerTarget = targetText.toLowerCase();
        long matchCount = keywords.stream().filter(kw -> lowerTarget.contains(kw.toLowerCase())).count();
        return Math.min(100.0, ((double) matchCount / Math.max(1, keywords.size())) * 100.0);
    }
}