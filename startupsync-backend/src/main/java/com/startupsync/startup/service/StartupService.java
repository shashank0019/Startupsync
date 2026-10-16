package com.startupsync.startup.service;

import com.startupsync.startup.dto.StartupDto;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

import com.startupsync.startup.dto.StartupCreateRequest;
import com.startupsync.startup.dto.StartupListResponse;
import com.startupsync.startup.dto.StartupResponse;

public interface StartupService {
    Page<StartupDto> getAllStartups(Pageable pageable);
    Page<StartupDto> searchAndFilterStartups(String search, String industry, String fundingStage, Boolean isRemote, Pageable pageable);
    Page<StartupDto> getRecommendedStartups(String userId, Pageable pageable);
    Page<StartupDto> getTrendingStartups(Pageable pageable);
    
    StartupResponse getStartupById(String id);
    Page<StartupListResponse> getActivePublicStartups(Pageable pageable);
    List<StartupResponse> getStartupsByFounderId(String founderId);
    Page<StartupListResponse> getStartupsByIndustry(String industry, Pageable pageable);
    Page<StartupListResponse> getStartupsByLocation(String location, Pageable pageable);
    Page<StartupListResponse> getStartupsByFundingStage(String fundingStage, Pageable pageable);
    Page<StartupListResponse> searchStartups(String searchTerm, Pageable pageable);
    Page<StartupListResponse> getTrendingStartupsList(Pageable pageable);
    
    StartupResponse createStartup(String userId, StartupCreateRequest request);
    StartupResponse updateStartup(String id, String userId, StartupCreateRequest request);
    void deleteStartup(String id, String userId);
    StartupResponse updateStatus(String id, String userId, String status);
    void incrementViewCount(String id);
}