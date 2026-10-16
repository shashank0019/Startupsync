package com.startupsync.invitation.service;

import com.startupsync.invitation.dto.InvitationRequest;
import com.startupsync.invitation.dto.InvitationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface InvitationService {

    /**
     * Send invitation to user
     */
    InvitationResponse sendInvitation(String startupId, String userId, InvitationRequest request);

    /**
     * Accept invitation
     */
    InvitationResponse acceptInvitation(String invitationId, String userId);

    /**
     * Reject invitation
     */
    InvitationResponse rejectInvitation(String invitationId, String userId);

    /**
     * Get invitations sent to user
     */
    Page<InvitationResponse> getInvitationsForUser(String userId, Pageable pageable);

    /**
     * Get all invitations sent to user
     */
    List<InvitationResponse> getAllInvitationsForUser(String userId);

    /**
     * Get pending invitations for user
     */
    Page<InvitationResponse> getPendingInvitations(String userId, Pageable pageable);

    /**
     * Get invitations sent by a startup (founder only)
     */
    Page<InvitationResponse> getInvitationsByStartup(String startupId, String userId, Pageable pageable);

    /**
     * Get single invitation
     */
    InvitationResponse getInvitation(String invitationId);

    /**
     * Count pending invitations for a startup
     */
    long countPendingInvitations(String startupId);

    /**
     * Count pending invitations for a user
     */
    long countPendingInvitationsForUser(String userId);

    /**
     * Cancel invitation (founder only)
     */
    void cancelInvitation(String invitationId, String userId);
}
