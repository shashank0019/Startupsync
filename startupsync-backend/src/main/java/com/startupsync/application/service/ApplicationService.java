package com.startupsync.application.service;

import com.startupsync.application.dto.ApplicationRequest;
import com.startupsync.application.dto.ApplicationResponse;
import com.startupsync.application.dto.ApplicationReviewRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ApplicationService {

    /**
     * Apply to a startup
     */
    ApplicationResponse applyToStartup(String userId, String startupId, ApplicationRequest request);

    /**
     * Withdraw application
     */
    void withdrawApplication(String userId, String applicationId);

    /**
     * Get applications for a startup (founder only)
     */
    Page<ApplicationResponse> getApplicationsByStartup(String startupId, String userId, Pageable pageable);

    /**
     * Get all applications for a startup
     */
    List<ApplicationResponse> getAllApplicationsByStartup(String startupId);

    /**
     * Get applications by user (applicant)
     */
    Page<ApplicationResponse> getApplicationsByUser(String userId, Pageable pageable);

    /**
     * Get all applications by user
     */
    List<ApplicationResponse> getAllApplicationsByUser(String userId);

    /**
     * Get single application
     */
    ApplicationResponse getApplication(String applicationId);

    /**
     * Approve application (founder only)
     */
    ApplicationResponse approveApplication(String applicationId, String userId, ApplicationReviewRequest request);

    /**
     * Reject application (founder only)
     */
    ApplicationResponse rejectApplication(String applicationId, String userId, ApplicationReviewRequest request);

    /**
     * Transition application to REVIEWING
     */
    ApplicationResponse reviewApplication(String applicationId, String userId);

    /**
     * Count pending applications for a startup
     */
    long countPendingApplications(String startupId);

    /**
     * Count accepted applications for a startup
     */
    long countAcceptedApplications(String startupId);
}
