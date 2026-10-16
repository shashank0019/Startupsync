package com.startupsync.invitation.controller;

import com.startupsync.invitation.dto.InvitationRequest;
import com.startupsync.invitation.dto.InvitationResponse;
import com.startupsync.invitation.service.InvitationService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/invitations")
@Slf4j
public class InvitationController {

    @Autowired
    private InvitationService invitationService;

    @PostMapping("/send/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationResponse> sendInvitation(
            @PathVariable String startupId,
            Authentication authentication,
            @Valid @RequestBody InvitationRequest request) {

        log.info("Send invitation endpoint called for startup: {} by user: {}", startupId, authentication.getName());

        String userId = authentication.getName();
        InvitationResponse response = invitationService.sendInvitation(startupId, userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{invitationId}/accept")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationResponse> acceptInvitation(
            @PathVariable String invitationId,
            Authentication authentication) {

        log.info("Accept invitation endpoint called - ID: {} by user: {}", invitationId, authentication.getName());

        String userId = authentication.getName();
        InvitationResponse response = invitationService.acceptInvitation(invitationId, userId);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{invitationId}/reject")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationResponse> rejectInvitation(
            @PathVariable String invitationId,
            Authentication authentication) {

        log.info("Reject invitation endpoint called - ID: {} by user: {}", invitationId, authentication.getName());

        String userId = authentication.getName();
        InvitationResponse response = invitationService.rejectInvitation(invitationId, userId);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-invitations")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<InvitationResponse>> getMyInvitations(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get my invitations endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<InvitationResponse> invitations = invitationService.getInvitationsForUser(userId, pageable);

        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/pending")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<InvitationResponse>> getPendingInvitations(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get pending invitations endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<InvitationResponse> invitations = invitationService.getPendingInvitations(userId, pageable);

        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<InvitationResponse>> getStartupInvitations(
            @PathVariable String startupId,
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get startup invitations endpoint called - Startup: {} by user: {}", startupId, authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<InvitationResponse> invitations = invitationService.getInvitationsByStartup(startupId, userId, pageable);

        return ResponseEntity.ok(invitations);
    }

    @GetMapping("/{invitationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<InvitationResponse> getInvitation(@PathVariable String invitationId) {

        log.info("Get invitation endpoint called - ID: {}", invitationId);

        InvitationResponse invitation = invitationService.getInvitation(invitationId);

        return ResponseEntity.ok(invitation);
    }

    @DeleteMapping("/{invitationId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cancelInvitation(
            @PathVariable String invitationId,
            Authentication authentication) {

        log.info("Cancel invitation endpoint called - ID: {} by user: {}", invitationId, authentication.getName());

        String userId = authentication.getName();
        invitationService.cancelInvitation(invitationId, userId);

        return ResponseEntity.noContent().build();
    }
}
