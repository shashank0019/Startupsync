package com.startupsync.startup.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.exception.UnauthorizedException;
import com.startupsync.startup.dto.StartupCreateRequest;
import com.startupsync.startup.dto.StartupListResponse;
import com.startupsync.startup.dto.StartupResponse;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.activity.service.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class StartupServiceImpl implements StartupService {

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    
    @Transactional(readOnly = true)
    public StartupResponse getStartupById(String id) {
        log.debug("Fetching startup by ID: {}", id);

        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + id));

        // Increment view count asynchronously in a real scenario
        incrementViewCount(id);

        return mapToStartupResponse(startup);
    }



    
    @Transactional(readOnly = true)
    public List<StartupResponse> getStartupsByFounderId(String founderId) {
        log.debug("Fetching startups by founder ID: {}", founderId);

        return startupRepository.findByFounderId(founderId)
                .stream()
                .map(this::mapToStartupResponse)
                .collect(Collectors.toList());
    }

    
    @Transactional(readOnly = true)
    public Page<StartupListResponse> getActivePublicStartups(Pageable pageable) {
        log.debug("Fetching active public startups");

        return startupRepository.findActivePublicStartups(pageable)
                .map(this::mapToStartupListResponse);
    }

    
    @Transactional(readOnly = true)
    public Page<StartupListResponse> getStartupsByIndustry(String industry, Pageable pageable) {
        log.debug("Fetching startups by industry: {}", industry);

        if (!StringUtils.hasText(industry)) {
            throw new BadRequestException("Industry cannot be empty");
        }

        return startupRepository.findByIndustry(industry, pageable)
                .map(this::mapToStartupListResponse);
    }

    
    @Transactional(readOnly = true)
    public Page<StartupListResponse> getStartupsByLocation(String location, Pageable pageable) {
        log.debug("Fetching startups by location: {}", location);

        if (!StringUtils.hasText(location)) {
            throw new BadRequestException("Location cannot be empty");
        }

        return startupRepository.findByLocation(location, pageable)
                .map(this::mapToStartupListResponse);
    }

    
    @Transactional(readOnly = true)
    public Page<StartupListResponse> getStartupsByFundingStage(String fundingStage, Pageable pageable) {
        log.debug("Fetching startups by funding stage: {}", fundingStage);

        if (!StringUtils.hasText(fundingStage)) {
            throw new BadRequestException("Funding stage cannot be empty");
        }

        return startupRepository.findByFundingStage(fundingStage, pageable)
                .map(this::mapToStartupListResponse);
    }

    
    @Transactional(readOnly = true)
    public Page<StartupListResponse> searchStartups(String searchTerm, Pageable pageable) {
        log.debug("Searching startups with term: {}", searchTerm);

        if (!StringUtils.hasText(searchTerm)) {
            throw new BadRequestException("Search term cannot be empty");
        }

        return startupRepository.searchStartups(searchTerm, pageable)
                .map(this::mapToStartupListResponse);
    }

    
    @Override
    @Transactional(readOnly = true)
    public Page<StartupListResponse> getTrendingStartupsList(Pageable pageable) {
        log.debug("Fetching trending startups");

        return startupRepository.findTrendingStartups(pageable)
                .map(this::mapToStartupListResponse);
    }

    
    public StartupResponse createStartup(String userId, StartupCreateRequest request) {
        log.info("Creating startup for user: {}", userId);

        User founder = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Verify user has FOUNDER or MEMBER role
        String roleNameLower = founder.getRole().getName().toUpperCase();
        if (!roleNameLower.contains("FOUNDER") && !roleNameLower.contains("MEMBER")) {
            // Allow both roles to create startups
        }

        Startup startup = Startup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .tagline(request.getTagline())
                .founder(founder)
                .industry(request.getIndustry())
                .fundingStage(request.getFundingStage())
                .teamSizeNeeded(request.getTeamSizeNeeded())
                .location(request.getLocation())
                .websiteUrl(request.getWebsiteUrl())
                .isRemote(request.getIsRemote() != null ? request.getIsRemote() : false)
                .requiredSkillIds(request.getRequiredSkillIds() != null ? new java.util.ArrayList<>(request.getRequiredSkillIds()) : null)
                .visibility(request.getVisibility() != null ? request.getVisibility() : "PUBLIC")
                .mission(request.getMission())
                .vision(request.getVision())
                .status("DRAFT")
                .viewCount(0)
                .applicationCount(0)
                .createdBy(userId)
                .build();

        startup = startupRepository.save(startup);
        log.info("Startup created successfully: {}", startup.getId());
        activityService.recordActivity(userId, "Startup Created", "Created startup " + startup.getName(), "STARTUP_CREATED", "STARTUP", startup.getId());

        return mapToStartupResponse(startup);
    }

    
    public StartupResponse updateStartup(String id, String userId, StartupCreateRequest request) {
        log.info("Updating startup: {} by user: {}", id, userId);

        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + id));

        // Verify user is founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can update this startup");
        }

        startup.setName(request.getName());
        startup.setDescription(request.getDescription());
        startup.setTagline(request.getTagline());
        startup.setIndustry(request.getIndustry());
        startup.setFundingStage(request.getFundingStage());
        startup.setTeamSizeNeeded(request.getTeamSizeNeeded());
        startup.setLocation(request.getLocation());
        startup.setWebsiteUrl(request.getWebsiteUrl());
        startup.setRemote(request.getIsRemote() != null ? request.getIsRemote() : false);
        startup.setRequiredSkillIds(request.getRequiredSkillIds() != null ? new java.util.ArrayList<>(request.getRequiredSkillIds()) : null);
        startup.setVisibility(request.getVisibility() != null ? request.getVisibility() : "PUBLIC");
        startup.setMission(request.getMission());
        startup.setVision(request.getVision());
        startup.setUpdatedBy(userId);

        startup = startupRepository.save(startup);
        log.info("Startup updated successfully: {}", id);
        activityService.recordActivity(userId, "Startup Updated", "Updated startup " + startup.getName(), "STARTUP_UPDATED", "STARTUP", startup.getId());

        return mapToStartupResponse(startup);
    }

    
    public void deleteStartup(String id, String userId) {
        log.info("Deleting startup: {} by user: {}", id, userId);

        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + id));

        // Verify user is founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can delete this startup");
        }

        startup.setDeletedAt(LocalDateTime.now());
        startupRepository.save(startup);

        log.info("Startup deleted successfully: {}", id);
    }

    
    public StartupResponse updateStatus(String id, String userId, String status) {
        log.info("Updating status for startup: {} to: {}", id, status);

        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + id));

        // Verify user is founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can update startup status");
        }

        // Validate status
        if (!isValidStatus(status)) {
            throw new BadRequestException("Invalid status: " + status);
        }

        startup.setStatus(status);
        startup.setUpdatedBy(userId);

        startup = startupRepository.save(startup);
        log.info("Startup status updated successfully: {}", id);
        activityService.recordActivity(userId, "Startup Updated", "Updated startup status to " + status + " for " + startup.getName(), "STARTUP_UPDATED", "STARTUP", startup.getId());

        return mapToStartupResponse(startup);
    }

    
    public void incrementViewCount(String id) {
        log.debug("Incrementing view count for startup: {}", id);

        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + id));

        startup.setViewCount(startup.getViewCount() != null ? startup.getViewCount() + 1 : 1);
        startupRepository.save(startup);
    }

    private StartupResponse mapToStartupResponse(Startup startup) {
        return StartupResponse.builder()
                .id(startup.getId())
                .name(startup.getName())
                .description(startup.getDescription())
                .tagline(startup.getTagline())
                .logoUrl(startup.getLogoUrl())
                .founder(StartupResponse.FounderDTO.builder()
                        .id(startup.getFounder().getId())
                        .firstName(startup.getFounder().getFirstName())
                        .lastName(startup.getFounder().getLastName())
                        .email(startup.getFounder().getEmail())
                        .profilePhotoUrl(startup.getFounder().getProfilePhotoUrl())
                        .build())
                .industry(startup.getIndustry())
                .fundingStage(startup.getFundingStage())
                .status(startup.getStatus())
                .teamSizeNeeded(startup.getTeamSizeNeeded())
                .location(startup.getLocation())
                .websiteUrl(startup.getWebsiteUrl())
                .isRemote(startup.isRemote())
                .requiredSkillIds(startup.getRequiredSkillIds() != null ? new java.util.HashSet<>(startup.getRequiredSkillIds()) : null)
                .visibility(startup.getVisibility())
                .viewCount(startup.getViewCount())
                .applicationCount(startup.getApplicationCount())
                .createdAt(startup.getCreatedAt())
                .updatedAt(startup.getUpdatedAt())
                .mission(startup.getMission())
                .vision(startup.getVision())
                .build();
    }

    private StartupListResponse mapToStartupListResponse(Startup startup) {
        return StartupListResponse.builder()
                .id(startup.getId())
                .name(startup.getName())
                .tagline(startup.getTagline())
                .logoUrl(startup.getLogoUrl())
                .founderName(startup.getFounder().getFirstName() + " " + startup.getFounder().getLastName())
                .industry(startup.getIndustry())
                .fundingStage(startup.getFundingStage())
                .status(startup.getStatus())
                .teamSizeNeeded(startup.getTeamSizeNeeded())
                .location(startup.getLocation())
                .isRemote(startup.isRemote())
                .viewCount(startup.getViewCount())
                .applicationCount(startup.getApplicationCount())
                .createdAt(startup.getCreatedAt())
                .build();
    }

    private boolean isValidStatus(String status) {
        return status != null && (
                status.equalsIgnoreCase("DRAFT") ||
                status.equalsIgnoreCase("ACTIVE") ||
                status.equalsIgnoreCase("PAUSED") ||
                status.equalsIgnoreCase("COMPLETED")
        );
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<com.startupsync.startup.dto.StartupDto> getAllStartups(Pageable pageable) {
        return startupRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<com.startupsync.startup.dto.StartupDto> searchAndFilterStartups(String search, String industry, String fundingStage, Boolean isRemote, Pageable pageable) {
        return startupRepository.searchAndFilterStartups(
                search != null && !search.isEmpty() ? search : null,
                industry != null && !industry.isEmpty() ? industry : null,
                fundingStage != null && !fundingStage.isEmpty() ? fundingStage : null,
                isRemote,
                pageable
        ).map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<com.startupsync.startup.dto.StartupDto> getRecommendedStartups(String userId, Pageable pageable) {
        log.debug("Fetching recommended startups for user: {}", userId);
        // For now, return active startups sorted by view count and application count
        // In a real implementation, this would use a recommendation algorithm based on user skills
        return startupRepository.findActivePublicStartups(pageable)
                .map(this::mapToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<com.startupsync.startup.dto.StartupDto> getTrendingStartups(Pageable pageable) {
        log.debug("Fetching trending startups");
        return startupRepository.findTrendingStartups(pageable)
                .map(this::mapToDto);
    }

    private com.startupsync.startup.dto.StartupDto mapToDto(Startup startup) {
        return com.startupsync.startup.dto.StartupDto.builder()
                .id(startup.getId() != null ? java.util.UUID.fromString(startup.getId()) : null)
                .name(startup.getName())
                .logoUrl(startup.getLogoUrl())
                .tagline(startup.getTagline())
                .description(startup.getDescription())
                .industry(startup.getIndustry())
                .fundingStage(startup.getFundingStage())
                .location(startup.getLocation())
                .isRemote(startup.isRemote())
                .requiredSkills(startup.getRequiredSkills())
                .build();
    }
}
