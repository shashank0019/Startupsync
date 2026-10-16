package com.startupsync.team.controller;

import com.startupsync.team.dto.TeamCreateRequest;
import com.startupsync.team.dto.TeamMemberRequest;
import com.startupsync.team.dto.TeamResponse;
import com.startupsync.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import java.util.List;

@RestController
@RequestMapping("/teams")
@Slf4j
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TeamResponse>> getAllTeams(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "10") int pageSize) {

        log.info("Get all teams endpoint called - page: {}, size: {}", pageNumber, pageSize);

        Pageable pageable = PageRequest.of(pageNumber, pageSize);
        Page<TeamResponse> teams = teamService.getAllTeams(pageable);

        return ResponseEntity.ok(teams);
    }

    @PostMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> createTeam(
            @PathVariable String startupId,
            Authentication authentication,
            @Valid @RequestBody TeamCreateRequest request) {

        log.info("Create team endpoint called for startup: {} by user: {}", startupId, authentication.getName());

        String userId = authentication.getName();
        TeamResponse response = teamService.createTeam(startupId, userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-teams")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getMyTeams(Authentication authentication) {

        log.info("Get my teams endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        List<TeamResponse> teams = teamService.getUserTeams(userId);

        return ResponseEntity.ok(teams);
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getTeamsByStartup(@PathVariable String startupId) {

        log.info("Get teams by startup endpoint called - Startup: {}", startupId);

        List<TeamResponse> teams = teamService.getTeamsByStartup(startupId);

        return ResponseEntity.ok(teams);
    }

    @GetMapping("/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable String teamId) {

        log.info("Get team endpoint called - ID: {}", teamId);

        TeamResponse response = teamService.getTeamById(teamId);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> addTeamMember(
            @PathVariable String teamId,
            Authentication authentication,
            @Valid @RequestBody TeamMemberRequest request) {

        log.info("Add team member endpoint called - Team: {} by user: {}", teamId, authentication.getName());

        String userId = authentication.getName();
        TeamResponse response = teamService.addMember(teamId, userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> removeTeamMember(
            @PathVariable String teamId,
            @PathVariable String memberId,
            Authentication authentication) {

        log.info("Remove team member endpoint called - Team: {}, Member: {} by user: {}", teamId, memberId, authentication.getName());

        String userId = authentication.getName();
        teamService.removeMember(teamId, memberId, userId);

        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{teamId}/members/{memberId}/role")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> changeMemberRole(
            @PathVariable String teamId,
            @PathVariable String memberId,
            @RequestParam String role,
            Authentication authentication) {

        log.info("Change member role endpoint called - Team: {}, Member: {}, Role: {} by user: {}", teamId, memberId, role, authentication.getName());

        String userId = authentication.getName();
        TeamResponse response = teamService.changeMemberRole(teamId, memberId, userId, role);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{teamId}/members")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse.TeamMemberDTO>> getTeamMembers(@PathVariable String teamId) {

        log.info("Get team members endpoint called - Team: {}", teamId);

        List<TeamResponse.TeamMemberDTO> members = teamService.getTeamMembers(teamId);

        return ResponseEntity.ok(members);
    }

    @DeleteMapping("/{teamId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTeam(
            @PathVariable String teamId,
            Authentication authentication) {

        log.info("Delete team endpoint called - ID: {} by user: {}", teamId, authentication.getName());

        String userId = authentication.getName();
        teamService.deleteTeam(teamId, userId);

        return ResponseEntity.noContent().build();
    }
}
