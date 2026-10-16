package com.startupsync.application.service;

import com.startupsync.activity.service.ActivityService;
import com.startupsync.application.dto.ApplicationRequest;
import com.startupsync.application.dto.ApplicationResponse;
import com.startupsync.application.dto.ApplicationReviewRequest;
import com.startupsync.application.entity.Application;
import com.startupsync.application.repository.ApplicationRepository;
import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.exception.UnauthorizedException;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public ApplicationResponse applyToStartup(String userId, String startupId, ApplicationRequest request) {
        log.info("User {} applying to startup {}", userId, startupId);

        User applicant = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        // Check if already applied
        if (applicationRepository.findByApplicantIdAndStartupId(userId, startupId).isPresent()) {
            throw new BadRequestException("You have already applied to this startup");
        }

        // Check if applicant is the founder
        if (startup.getFounder().getId().equals(userId)) {
            throw new BadRequestException("Founder cannot apply to their own startup");
        }

        // Check if startup is accepting applications
        if (!startup.getStatus().equalsIgnoreCase("ACTIVE")) {
            throw new BadRequestException("This startup is not accepting applications");
        }

        Application application = Application.builder()
                .applicant(applicant)
                .startup(startup)
                .status("PENDING")
                .coverLetter(request.getCoverLetter())
                .build();

        application = applicationRepository.save(application);
        log.info("Application created successfully: {}", application.getId());

        activityService.recordActivity(userId, "Application submitted",
                "You applied to " + startup.getName(), "APPLICATION", "STARTUP", startupId);
        activityService.recordActivity(startup.getFounder().getId(), "New application received",
                applicant.getFirstName() + " applied to " + startup.getName(),
                "APPLICATION", "APPLICATION", application.getId());

        return mapToApplicationResponse(application);
    }

    @Override
    public void withdrawApplication(String userId, String applicationId) {
        log.info("User {} withdrawing application {}", userId, applicationId);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // Verify user is the applicant
        if (!application.getApplicant().getId().equals(userId)) {
            throw new UnauthorizedException("You can only withdraw your own applications");
        }

        // Check if application is still pending or reviewing
        if (!application.getStatus().equalsIgnoreCase("PENDING") && !application.getStatus().equalsIgnoreCase("REVIEWING")) {
            throw new BadRequestException("Cannot withdraw a " + application.getStatus() + " application");
        }

        application.setStatus("WITHDRAWN");
        applicationRepository.save(application);
        log.info("Application withdrawn successfully: {}", applicationId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByStartup(String startupId, String userId, Pageable pageable) {
        log.debug("Fetching applications for startup {}", startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        // Verify user is the founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can view applications for this startup");
        }

        return applicationRepository.findByStartupId(startupId, pageable)
                .map(this::mapToApplicationResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplicationsByStartup(String startupId) {
        log.debug("Fetching all applications for startup {}", startupId);

        return applicationRepository.findByStartupId(startupId)
                .stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationResponse> getApplicationsByUser(String userId, Pageable pageable) {
        log.debug("Fetching applications for user {}", userId);

        return applicationRepository.findByApplicantId(userId, pageable)
                .map(this::mapToApplicationResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getAllApplicationsByUser(String userId) {
        log.debug("Fetching all applications for user {}", userId);

        return applicationRepository.findByApplicantId(userId)
                .stream()
                .map(this::mapToApplicationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplication(String applicationId) {
        log.debug("Fetching application {}", applicationId);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        return mapToApplicationResponse(application);
    }

    @Override
    public ApplicationResponse approveApplication(String applicationId, String userId, ApplicationReviewRequest request) {
        log.info("Approving application {} by user {}", applicationId, userId);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // Verify user is the founder
        if (!application.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can approve applications");
        }

        // Check if application is pending or reviewing
        if (!application.getStatus().equalsIgnoreCase("PENDING") && !application.getStatus().equalsIgnoreCase("REVIEWING")) {
            throw new BadRequestException("Application status is already " + application.getStatus());
        }

        application.setStatus("APPROVED");
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(userId);

        application = applicationRepository.save(application);
        log.info("Application approved: {}", applicationId);

        return mapToApplicationResponse(application);
    }

    @Override
    public ApplicationResponse rejectApplication(String applicationId, String userId, ApplicationReviewRequest request) {
        log.info("Rejecting application {} by user {}", applicationId, userId);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // Verify user is the founder
        if (!application.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can reject applications");
        }

        // Check if application is pending or reviewing
        if (!application.getStatus().equalsIgnoreCase("PENDING") && !application.getStatus().equalsIgnoreCase("REVIEWING")) {
            throw new BadRequestException("Application status is already " + application.getStatus());
        }

        application.setStatus("REJECTED");
        application.setReviewedAt(LocalDateTime.now());
        application.setReviewedBy(userId);
        application.setRejectionReason(request.getReason());

        application = applicationRepository.save(application);
        log.info("Application rejected: {}", applicationId);

        return mapToApplicationResponse(application);
    }

    @Override
    public ApplicationResponse reviewApplication(String applicationId, String userId) {
        log.info("Setting application {} to REVIEWING status by user {}", applicationId, userId);

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + applicationId));

        // Verify user is the founder
        if (!application.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can review applications");
        }

        // Check if application is pending
        if (!application.getStatus().equalsIgnoreCase("PENDING")) {
            throw new BadRequestException("Application status must be PENDING to move to REVIEWING. Current status: " + application.getStatus());
        }

        application.setStatus("REVIEWING");
        application = applicationRepository.save(application);
        log.info("Application set to REVIEWING: {}", applicationId);

        return mapToApplicationResponse(application);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPendingApplications(String startupId) {
        return applicationRepository.countPendingByStartupId(startupId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countAcceptedApplications(String startupId) {
        return applicationRepository.countAcceptedByStartupId(startupId);
    }

    private ApplicationResponse mapToApplicationResponse(Application application) {
        return ApplicationResponse.builder()
                .id(application.getId())
                .applicant(ApplicationResponse.ApplicantDTO.builder()
                        .id(application.getApplicant().getId())
                        .firstName(application.getApplicant().getFirstName())
                        .lastName(application.getApplicant().getLastName())
                        .email(application.getApplicant().getEmail())
                        .profilePhotoUrl(application.getApplicant().getProfilePhotoUrl())
                        .build())
                .startup(ApplicationResponse.StartupDTO.builder()
                        .id(application.getStartup().getId())
                        .name(application.getStartup().getName())
                        .industry(application.getStartup().getIndustry())
                        .logoUrl(application.getStartup().getLogoUrl())
                        .build())
                .status(application.getStatus())
                .coverLetter(application.getCoverLetter())
                .appliedAt(application.getAppliedAt())
                .reviewedAt(application.getReviewedAt())
                .rejectionReason(application.getRejectionReason())
                .build();
    }
}
