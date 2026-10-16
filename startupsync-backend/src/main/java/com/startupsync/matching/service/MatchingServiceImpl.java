package com.startupsync.matching.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.matching.dto.MatchedCandidateDTO;
import com.startupsync.matching.dto.MatchedStartupDTO;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.user.entity.UserProfile;
import com.startupsync.user.repository.UserProfileRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional(readOnly = true)
public class MatchingServiceImpl implements MatchingService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    private static final Double SKILLS_WEIGHT = 0.40;
    private static final Double EXPERIENCE_WEIGHT = 0.20;
    private static final Double INDUSTRY_WEIGHT = 0.15;
    private static final Double LOCATION_WEIGHT = 0.10;
    private static final Double AVAILABILITY_WEIGHT = 0.15;

    @Override
    public Page<MatchedCandidateDTO> getMatchedCandidates(String startupId, Pageable pageable) {
        log.debug("Fetching matched candidates for startup: {}", startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        List<User> allUsers = userRepository.findAll();
        List<MatchedCandidateDTO> matchedCandidates = new ArrayList<>();
        int ranking = 1;

        for (User user : allUsers) {
            // Skip founder
            if (user.getId().equals(startup.getFounder().getId())) {
                continue;
            }

            Double overallScore = calculateCompatibilityScore(user.getId(), startupId);

            if (overallScore > 0) {
                MatchedCandidateDTO candidate = buildMatchedCandidateDTO(user, startup, overallScore, ranking);
                matchedCandidates.add(candidate);
                ranking++;
            }
        }

        // Sort by overall match percentage descending
        matchedCandidates.sort((a, b) -> b.getOverallMatchPercentage().compareTo(a.getOverallMatchPercentage()));

        // Update rankings after sorting
        for (int i = 0; i < matchedCandidates.size(); i++) {
            matchedCandidates.get(i).setMatchRanking(i + 1);
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), matchedCandidates.size());

        List<MatchedCandidateDTO> pageContent = matchedCandidates.subList(start, end);

        return new PageImpl<>(pageContent, pageable, matchedCandidates.size());
    }

    @Override
    public List<MatchedCandidateDTO> getTopMatchedCandidates(String startupId, int limit) {
        log.debug("Fetching top {} matched candidates for startup: {}", limit, startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        List<User> allUsers = userRepository.findAll();
        List<MatchedCandidateDTO> matchedCandidates = new ArrayList<>();
        int ranking = 1;

        for (User user : allUsers) {
            if (user.getId().equals(startup.getFounder().getId())) {
                continue;
            }

            Double overallScore = calculateCompatibilityScore(user.getId(), startupId);

            if (overallScore > 0) {
                MatchedCandidateDTO candidate = buildMatchedCandidateDTO(user, startup, overallScore, ranking);
                matchedCandidates.add(candidate);
                ranking++;
            }
        }

        matchedCandidates.sort((a, b) -> b.getOverallMatchPercentage().compareTo(a.getOverallMatchPercentage()));

        for (int i = 0; i < matchedCandidates.size(); i++) {
            matchedCandidates.get(i).setMatchRanking(i + 1);
        }

        return matchedCandidates.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public Double calculateCompatibilityScore(String userId, String startupId) {
        log.debug("Calculating compatibility score for user: {} and startup: {}", userId, startupId);

        Double skillsMatch = calculateSkillsMatch(userId, startupId);
        Double experienceMatch = calculateExperienceMatch(userId, startupId);
        Double industryMatch = calculateIndustryMatch(userId, startupId);
        Double locationMatch = calculateLocationMatch(userId, startupId);
        Double availabilityMatch = calculateAvailabilityMatch(userId, startupId);

        Double overallScore = (skillsMatch * SKILLS_WEIGHT) +
                (experienceMatch * EXPERIENCE_WEIGHT) +
                (industryMatch * INDUSTRY_WEIGHT) +
                (locationMatch * LOCATION_WEIGHT) +
                (availabilityMatch * AVAILABILITY_WEIGHT);

        return Math.round(overallScore * 100.0) / 100.0;
    }

    @Override
    public Double calculateSkillsMatch(String userId, String startupId) {
        log.debug("Calculating skills match for user: {} and startup: {}", userId, startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        Set<String> requiredSkills = new java.util.HashSet<>();
        if (startup.getRequiredSkills() != null) {
            for (String skill : startup.getRequiredSkills()) {
                requiredSkills.add(skill.toLowerCase().trim());
            }
        }
        if (startup.getRequiredSkillIds() != null) {
            for (String skillId : startup.getRequiredSkillIds()) {
                requiredSkills.add(skillId.toLowerCase().trim());
            }
        }

        if (requiredSkills.isEmpty()) {
            return 100.0;
        }

        Set<String> userSkills = new java.util.HashSet<>();
        if (profile != null && profile.getSkills() != null) {
            for (com.startupsync.skill.entity.Skill skill : profile.getSkills()) {
                userSkills.add(skill.getName().toLowerCase().trim());
            }
        }
        if (profile != null && profile.getCurrentJobTitle() != null && !profile.getCurrentJobTitle().isEmpty()) {
            userSkills.add(profile.getCurrentJobTitle().toLowerCase().trim());
        }

        long matchingSkills = userSkills.stream()
                .filter(requiredSkills::contains)
                .count();

        Double skillMatchPercentage = (double) (matchingSkills * 100) / requiredSkills.size();

        return Math.min(skillMatchPercentage, 100.0);
    }

    @Override
    public Double calculateExperienceMatch(String userId, String startupId) {
        log.debug("Calculating experience match for user: {} and startup: {}", userId, startupId);

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null) {
            return 0.0;
        }

        Integer yearsOfExperience = profile.getYearsOfExperience() != null ? profile.getYearsOfExperience() : 0;

        // Experience scoring: Each year of experience adds 10% up to 100%
        Double experienceScore = Math.min(yearsOfExperience * 10.0, 100.0);

        return experienceScore;
    }

    @Override
    public Double calculateIndustryMatch(String userId, String startupId) {
        log.debug("Calculating industry match for user: {} and startup: {}", userId, startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null) {
            return 0.0;
        }

        // If user's current company field matches or has relevant experience, provide match score
        String userCompany = profile.getCurrentCompany() != null ? profile.getCurrentCompany() : "";
        String startupIndustry = startup.getIndustry() != null ? startup.getIndustry() : "";
        
        if (!userCompany.isEmpty() && userCompany.equalsIgnoreCase(startupIndustry)) {
            return 100.0;
        }

        return 0.0;
    }

    @Override
    public Double calculateLocationMatch(String userId, String startupId) {
        log.debug("Calculating location match for user: {} and startup: {}", userId, startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // If startup is remote, 100% match for any location
        if (startup.isRemote()) {
            return 100.0;
        }

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(null);

        if (profile == null || profile.getLocation() == null) {
            return 0.0;
        }

        // If user's location matches startup's location, 100%, else 0%
        if (profile.getLocation().equalsIgnoreCase(startup.getLocation())) {
            return 100.0;
        }

        return 0.0;
    }

    private MatchedCandidateDTO buildMatchedCandidateDTO(User user, Startup startup, Double overallScore, int ranking) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);

        Double skillsMatch = calculateSkillsMatch(user.getId(), startup.getId());
        Double experienceMatch = calculateExperienceMatch(user.getId(), startup.getId());
        Double industryMatch = calculateIndustryMatch(user.getId(), startup.getId());
        Double locationMatch = calculateLocationMatch(user.getId(), startup.getId());

        Set<String> requiredSkills = new java.util.HashSet<>();
        if (startup.getRequiredSkills() != null) {
            for (String skill : startup.getRequiredSkills()) {
                requiredSkills.add(skill.toLowerCase().trim());
            }
        }
        if (startup.getRequiredSkillIds() != null) {
            for (String skillId : startup.getRequiredSkillIds()) {
                requiredSkills.add(skillId.toLowerCase().trim());
            }
        }

        Set<String> userSkills = new java.util.HashSet<>();
        if (profile != null && profile.getSkills() != null) {
            for (com.startupsync.skill.entity.Skill skill : profile.getSkills()) {
                userSkills.add(skill.getName().toLowerCase().trim());
            }
        }
        if (profile != null && profile.getCurrentJobTitle() != null && !profile.getCurrentJobTitle().isEmpty()) {
            userSkills.add(profile.getCurrentJobTitle().toLowerCase().trim());
        }

        Set<String> matchingSkills = userSkills.stream()
                .filter(requiredSkills::contains)
                .collect(Collectors.toSet());
        Set<String> missingSkills = new java.util.HashSet<>(requiredSkills);
        missingSkills.removeAll(userSkills);

        return MatchedCandidateDTO.builder()
                .userId(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .profilePhotoUrl(user.getProfilePhotoUrl())
                .headline(profile != null ? profile.getHeadline() : null)
                .location(profile != null ? profile.getLocation() : null)
                .skillsMatchPercentage(skillsMatch)
                .experienceMatchPercentage(experienceMatch)
                .industryMatchPercentage(industryMatch)
                .locationMatchPercentage(locationMatch)
                .overallMatchPercentage(overallScore)
                .matchRanking(ranking)
                .matchingSkills(new ArrayList<>(matchingSkills))
                .requiredSkillsMissing(new ArrayList<>(missingSkills))
                .yearsOfExperience(profile != null && profile.getYearsOfExperience() != null ? profile.getYearsOfExperience() : 0)
                .bio(profile != null ? profile.getBio() : null)
                .profileCompletionPercentage(user.getProfileCompletionPercentage() + "%")
                .build();
    }

    @Override
    public Double calculateAvailabilityMatch(String userId, String startupId) {
        log.debug("Calculating availability match for user: {}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String availability = user.getAvailabilityStatus() != null ? user.getAvailabilityStatus().toUpperCase() : "";

        if (availability.equals("AVAILABLE") || availability.equals("LOOKING")) {
            return 100.0;
        } else if (availability.equals("OPEN_TO_OPPORTUNITIES")) {
            return 50.0;
        } else {
            return 0.0;
        }
    }

    @Override
    public List<MatchedStartupDTO> getRecommendedStartups(String userId, int limit) {
        log.debug("Fetching recommended startups for user: {} with limit: {}", userId, limit);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Startup> allStartups = startupRepository.findAll();
        List<MatchedStartupDTO> recommendedStartups = new ArrayList<>();

        for (Startup startup : allStartups) {
            // Skip if user is the founder
            if (startup.getFounder() != null && startup.getFounder().getId().equals(userId)) {
                continue;
            }

            Double overallScore = calculateCompatibilityScore(userId, startup.getId());

            if (overallScore > 30) { // Only include startups with >30% match
                MatchedStartupDTO dto = buildMatchedStartupDTO(user, startup, overallScore);
                recommendedStartups.add(dto);
            }
        }

        // Sort by overall match percentage descending
        recommendedStartups.sort((a, b) -> b.getOverallMatchPercentage().compareTo(a.getOverallMatchPercentage()));

        return recommendedStartups.stream().limit(limit).collect(Collectors.toList());
    }

    @Override
    public MatchedStartupDTO getCompatibilityBreakdown(String userId, String startupId) {
        log.debug("Getting compatibility breakdown for user: {} and startup: {}", userId, startupId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        Double overallScore = calculateCompatibilityScore(userId, startupId);
        return buildMatchedStartupDTO(user, startup, overallScore);
    }

    private MatchedStartupDTO buildMatchedStartupDTO(User user, Startup startup, Double overallScore) {
        UserProfile profile = userProfileRepository.findByUserId(user.getId()).orElse(null);

        Double skillsMatch = calculateSkillsMatch(user.getId(), startup.getId());
        Double experienceMatch = calculateExperienceMatch(user.getId(), startup.getId());
        Double industryMatch = calculateIndustryMatch(user.getId(), startup.getId());
        Double locationMatch = calculateLocationMatch(user.getId(), startup.getId());
        Double availabilityMatch = calculateAvailabilityMatch(user.getId(), startup.getId());

        Set<String> requiredSkills = new java.util.HashSet<>();
        if (startup.getRequiredSkills() != null) {
            for (String skill : startup.getRequiredSkills()) {
                requiredSkills.add(skill.toLowerCase().trim());
            }
        }
        if (startup.getRequiredSkillIds() != null) {
            for (String skillId : startup.getRequiredSkillIds()) {
                requiredSkills.add(skillId.toLowerCase().trim());
            }
        }

        Set<String> userSkills = new java.util.HashSet<>();
        if (profile != null && profile.getSkills() != null) {
            for (com.startupsync.skill.entity.Skill skill : profile.getSkills()) {
                userSkills.add(skill.getName().toLowerCase().trim());
            }
        }
        if (profile != null && profile.getCurrentJobTitle() != null && !profile.getCurrentJobTitle().isEmpty()) {
            userSkills.add(profile.getCurrentJobTitle().toLowerCase().trim());
        }

        Set<String> matchingSkills = userSkills.stream()
                .filter(requiredSkills::contains)
                .collect(Collectors.toSet());
        Set<String> missingSkills = new java.util.HashSet<>(requiredSkills);
        missingSkills.removeAll(userSkills);

        return MatchedStartupDTO.builder()
                .startupId(startup.getId())
                .name(startup.getName())
                .logoUrl(startup.getLogoUrl())
                .tagline(startup.getTagline())
                .description(startup.getDescription())
                .industry(startup.getIndustry())
                .fundingStage(startup.getFundingStage())
                .location(startup.getLocation())
                .isRemote(startup.isRemote())
                .teamSizeNeeded(startup.getTeamSizeNeeded())
                .requiredSkills(startup.getRequiredSkills())
                .skillsMatchPercentage(skillsMatch)
                .experienceMatchPercentage(experienceMatch)
                .industryMatchPercentage(industryMatch)
                .locationMatchPercentage(locationMatch)
                .availabilityMatchPercentage(availabilityMatch)
                .overallMatchPercentage(overallScore)
                .matchingSkills(new ArrayList<>(matchingSkills))
                .skillsMissing(new ArrayList<>(missingSkills))
                .founderName(startup.getFounder() != null ? 
                        startup.getFounder().getFirstName() + " " + startup.getFounder().getLastName() : null)
                .founderEmail(startup.getFounder() != null ? startup.getFounder().getEmail() : null)
                .build();
    }
}
