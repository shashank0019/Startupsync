package com.startupsync.invitation.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.exception.UnauthorizedException;
import com.startupsync.invitation.dto.InvitationRequest;
import com.startupsync.invitation.dto.InvitationResponse;
import com.startupsync.invitation.entity.Invitation;
import com.startupsync.invitation.repository.InvitationRepository;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.activity.service.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class InvitationServiceImpl implements InvitationService {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public InvitationResponse sendInvitation(String startupId, String userId, InvitationRequest request) {
        log.info("Sending invitation from startup {} to user {} by user {}", startupId, request.getUserId(), userId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        // Verify user is the founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can send invitations");
        }

        User invitedUser = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        User invitedBy = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));

        // Check if already invited
        if (invitationRepository.findByStartupIdAndInvitedUserId(startupId, request.getUserId()).isPresent()) {
            throw new BadRequestException("User has already been invited to this startup");
        }

        // Check if inviting self
        if (startup.getFounder().getId().equals(request.getUserId())) {
            throw new BadRequestException("Cannot invite yourself");
        }

        Invitation invitation = Invitation.builder()
                .startup(startup)
                .invitedUser(invitedUser)
                .invitedBy(invitedBy)
                .status("PENDING")
                .position(request.getPosition())
                .message(request.getMessage())
                .build();

        invitation = invitationRepository.save(invitation);
        log.info("Invitation sent successfully: {}", invitation.getId());
        activityService.recordActivity(userId, "Invitation Sent", "Sent invitation to " + invitedUser.getFirstName() + " " + invitedUser.getLastName() + " to join " + startup.getName(), "INVITATION_SENT", "STARTUP", startup.getId());
        activityService.recordActivity(invitedUser.getId(), "Invitation Received", "Received invitation from " + startup.getName(), "INVITATION_RECEIVED", "STARTUP", startup.getId());

        return mapToInvitationResponse(invitation);
    }

    @Override
    public InvitationResponse acceptInvitation(String invitationId, String userId) {
        log.info("Accepting invitation {} by user {}", invitationId, userId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with ID: " + invitationId));

        // Verify user is the invited user
        if (!invitation.getInvitedUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only accept invitations sent to you");
        }

        // Check if invitation is pending
        if (!invitation.getStatus().equalsIgnoreCase("PENDING")) {
            throw new BadRequestException("Invitation status is already " + invitation.getStatus());
        }

        invitation.setStatus("ACCEPTED");
        invitation.setRespondedAt(LocalDateTime.now());

        invitation = invitationRepository.save(invitation);
        log.info("Invitation accepted: {}", invitationId);
        activityService.recordActivity(userId, "Invitation Accepted", "Accepted invitation to join " + invitation.getStartup().getName(), "INVITATION_ACCEPTED", "STARTUP", invitation.getStartup().getId());
        activityService.recordActivity(invitation.getInvitedBy().getId(), "Invitation Accepted", invitation.getInvitedUser().getFirstName() + " accepted invitation to join " + invitation.getStartup().getName(), "INVITATION_ACCEPTED", "STARTUP", invitation.getStartup().getId());

        return mapToInvitationResponse(invitation);
    }

    @Override
    public InvitationResponse rejectInvitation(String invitationId, String userId) {
        log.info("Rejecting invitation {} by user {}", invitationId, userId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with ID: " + invitationId));

        // Verify user is the invited user
        if (!invitation.getInvitedUser().getId().equals(userId)) {
            throw new UnauthorizedException("You can only reject invitations sent to you");
        }

        // Check if invitation is pending
        if (!invitation.getStatus().equalsIgnoreCase("PENDING")) {
            throw new BadRequestException("Invitation status is already " + invitation.getStatus());
        }

        invitation.setStatus("DECLINED");
        invitation.setRespondedAt(LocalDateTime.now());

        invitation = invitationRepository.save(invitation);
        log.info("Invitation declined: {}", invitationId);
        activityService.recordActivity(userId, "Invitation Declined", "Declined invitation to join " + invitation.getStartup().getName(), "INVITATION_REJECTED", "STARTUP", invitation.getStartup().getId());

        return mapToInvitationResponse(invitation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvitationResponse> getInvitationsForUser(String userId, Pageable pageable) {
        log.debug("Fetching invitations for user {}", userId);

        return invitationRepository.findByInvitedUserId(userId, pageable)
                .map(this::mapToInvitationResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvitationResponse> getAllInvitationsForUser(String userId) {
        log.debug("Fetching all invitations for user {}", userId);

        return invitationRepository.findByInvitedUserId(userId)
                .stream()
                .map(this::mapToInvitationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvitationResponse> getPendingInvitations(String userId, Pageable pageable) {
        log.debug("Fetching pending invitations for user {}", userId);

        return invitationRepository.findPendingInvitations(userId, pageable)
                .map(this::mapToInvitationResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InvitationResponse> getInvitationsByStartup(String startupId, String userId, Pageable pageable) {
        log.debug("Fetching invitations for startup {}", startupId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        // Verify user is the founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can view invitations for this startup");
        }

        return invitationRepository.findByStartupId(startupId, pageable)
                .map(this::mapToInvitationResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public InvitationResponse getInvitation(String invitationId) {
        log.debug("Fetching invitation {}", invitationId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with ID: " + invitationId));

        return mapToInvitationResponse(invitation);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPendingInvitations(String startupId) {
        return invitationRepository.countPendingByStartupId(startupId);
    }

    @Override
    @Transactional(readOnly = true)
    public long countPendingInvitationsForUser(String userId) {
        return invitationRepository.countPendingByUserId(userId);
    }

    @Override
    public void cancelInvitation(String invitationId, String userId) {
        log.info("Canceling invitation {} by user {}", invitationId, userId);

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with ID: " + invitationId));

        // Verify user is the founder who sent the invitation
        if (!invitation.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can cancel invitations");
        }

        // Check if invitation is still pending
        if (!invitation.getStatus().equalsIgnoreCase("PENDING")) {
            throw new BadRequestException("Cannot cancel a " + invitation.getStatus() + " invitation");
        }

        invitationRepository.deleteById(invitationId);
        log.info("Invitation canceled: {}", invitationId);
    }

    private InvitationResponse mapToInvitationResponse(Invitation invitation) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .startup(InvitationResponse.StartupDTO.builder()
                        .id(invitation.getStartup().getId())
                        .name(invitation.getStartup().getName())
                        .industry(invitation.getStartup().getIndustry())
                        .logoUrl(invitation.getStartup().getLogoUrl())
                        .build())
                .invitedUser(InvitationResponse.InvitedUserDTO.builder()
                        .id(invitation.getInvitedUser().getId())
                        .firstName(invitation.getInvitedUser().getFirstName())
                        .lastName(invitation.getInvitedUser().getLastName())
                        .email(invitation.getInvitedUser().getEmail())
                        .profilePhotoUrl(invitation.getInvitedUser().getProfilePhotoUrl())
                        .build())
                .invitedBy(InvitationResponse.InvitedByDTO.builder()
                        .id(invitation.getInvitedBy().getId())
                        .firstName(invitation.getInvitedBy().getFirstName())
                        .lastName(invitation.getInvitedBy().getLastName())
                        .build())
                .status(invitation.getStatus())
                .position(invitation.getPosition())
                .message(invitation.getMessage())
                .createdAt(invitation.getCreatedAt())
                .respondedAt(invitation.getRespondedAt())
                .build();
    }
}
