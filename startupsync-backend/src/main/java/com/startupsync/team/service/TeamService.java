package com.startupsync.team.service;

import com.startupsync.team.dto.TeamCreateRequest;
import com.startupsync.team.dto.TeamMemberRequest;
import com.startupsync.team.dto.TeamResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TeamService {

    /**
     * Get all teams with pagination
     */
    Page<TeamResponse> getAllTeams(Pageable pageable);

    /**
     * Create a new team for a startup
     */
    TeamResponse createTeam(String startupId, String userId, TeamCreateRequest request);

    /**
     * Get team by ID
     */
    TeamResponse getTeamById(String teamId);

    /**
     * Get teams by startup
     */
    List<TeamResponse> getTeamsByStartup(String startupId);

    /**
     * Add member to team
     */
    TeamResponse addMember(String teamId, String userId, TeamMemberRequest request);

    /**
     * Remove member from team
     */
    void removeMember(String teamId, String memberId, String userId);

    /**
     * Change member role
     */
    TeamResponse changeMemberRole(String teamId, String memberId, String userId, String newRole);

    /**
     * Get team members
     */
    List<TeamResponse.TeamMemberDTO> getTeamMembers(String teamId);

    /**
     * Get user's teams
     */
    List<TeamResponse> getUserTeams(String userId);

    /**
     * Delete team
     */
    void deleteTeam(String teamId, String userId);
}
