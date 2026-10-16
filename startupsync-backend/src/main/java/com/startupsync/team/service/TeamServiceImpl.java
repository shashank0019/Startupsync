package com.startupsync.team.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.exception.UnauthorizedException;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.team.dto.TeamCreateRequest;
import com.startupsync.team.dto.TeamMemberRequest;
import com.startupsync.team.dto.TeamResponse;
import com.startupsync.team.entity.Team;
import com.startupsync.team.entity.TeamMember;
import com.startupsync.team.repository.TeamMemberRepository;
import com.startupsync.team.repository.TeamRepository;
import com.startupsync.activity.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@Transactional
public class TeamServiceImpl implements TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TeamMemberRepository teamMemberRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public TeamResponse createTeam(String startupId, String userId, TeamCreateRequest request) {
        log.info("Creating team for startup: {} by user: {}", startupId, userId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        // Verify user is the founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can create a team");
        }

        User founder = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Team team = Team.builder()
                .startup(startup)
                .name(request.getName())
                .description(request.getDescription())
                .memberCount(1)
                .createdBy(userId)
                .build();

        team = teamRepository.save(team);

        // Add founder as first member
        TeamMember founderMember = TeamMember.builder()
                .team(team)
                .user(founder)
                .role("FOUNDER")
                .build();

        teamMemberRepository.save(founderMember);

        log.info("Team created successfully: {}", team.getId());

        return mapToTeamResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeamById(String teamId) {
        log.debug("Fetching team: {}", teamId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        return mapToTeamResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getTeamsByStartup(String startupId) {
        log.debug("Fetching teams for startup: {}", startupId);

        return teamRepository.findByStartupId(startupId)
                .stream()
                .map(this::mapToTeamResponse)
                .collect(Collectors.toList());
    }

    @Override
    public TeamResponse addMember(String teamId, String userId, TeamMemberRequest request) {
        log.info("Adding member to team: {} by user: {}", teamId, userId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Verify user is the founder of the startup
        if (!team.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can add members to the team");
        }

        User newMember = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getUserId()));

        // Check if user is already a member
        if (teamMemberRepository.findByTeamIdAndUserId(teamId, request.getUserId()).isPresent()) {
            throw new BadRequestException("User is already a member of this team");
        }

        TeamMember teamMember = TeamMember.builder()
                .team(team)
                .user(newMember)
                .role(request.getRole() != null ? request.getRole() : "MEMBER")
                .position(request.getPosition())
                .build();

        teamMemberRepository.save(teamMember);

        // Update member count
        team.setMemberCount(team.getMemberCount() + 1);
        team = teamRepository.save(team);

        log.info("Member added to team: {}", teamId);
        activityService.recordActivity(userId, "Member Joined", "Added " + newMember.getFirstName() + " " + newMember.getLastName() + " to team " + team.getName(), "MEMBER_JOINED", "STARTUP", team.getStartup().getId());
        activityService.recordActivity(newMember.getId(), "Member Joined", "Joined team " + team.getName(), "MEMBER_JOINED", "STARTUP", team.getStartup().getId());

        return mapToTeamResponse(team);
    }

    @Override
    public void removeMember(String teamId, String memberId, String userId) {
        log.info("Removing member: {} from team: {} by user: {}", memberId, teamId, userId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Verify user is the founder
        if (!team.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can remove members");
        }

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found with ID: " + memberId));

        // Don't allow removing founder
        if ("FOUNDER".equalsIgnoreCase(member.getRole())) {
            throw new BadRequestException("Cannot remove the founder from the team");
        }

        teamMemberRepository.deleteById(memberId);

        // Update member count
        team.setMemberCount(Math.max(team.getMemberCount() - 1, 0));
        teamRepository.save(team);

        log.info("Member removed from team: {}", teamId);
        activityService.recordActivity(userId, "Member Removed", "Removed member from team " + team.getName(), "MEMBER_REMOVED", "STARTUP", team.getStartup().getId());
        activityService.recordActivity(member.getUser().getId(), "Member Removed", "You were removed from team " + team.getName(), "MEMBER_REMOVED", "STARTUP", team.getStartup().getId());
    }

    @Override
    public TeamResponse changeMemberRole(String teamId, String memberId, String userId, String newRole) {
        log.info("Changing member role for team: {} by user: {}", teamId, userId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Verify user is the founder
        if (!team.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can change member roles");
        }

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new ResourceNotFoundException("Team member not found with ID: " + memberId));

        // Don't allow changing founder role
        if ("FOUNDER".equalsIgnoreCase(member.getRole())) {
            throw new BadRequestException("Cannot change the founder's role");
        }

        // Validate new role
        if (!isValidRole(newRole)) {
            throw new BadRequestException("Invalid role: " + newRole);
        }

        member.setRole(newRole);
        teamMemberRepository.save(member);

        log.info("Member role changed: {}", teamId);

        return mapToTeamResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse.TeamMemberDTO> getTeamMembers(String teamId) {
        log.debug("Fetching members for team: {}", teamId);

        return teamMemberRepository.findByTeamId(teamId)
                .stream()
                .map(this::mapToTeamMemberDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamResponse> getUserTeams(String userId) {
        log.debug("Fetching teams for user: {}", userId);

        return teamMemberRepository.findByUserId(userId)
                .stream()
                .map(TeamMember::getTeam)
                .distinct()
                .map(this::mapToTeamResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTeam(String teamId, String userId) {
        log.info("Deleting team: {} by user: {}", teamId, userId);

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Verify user is the founder
        if (!team.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can delete the team");
        }

        teamRepository.deleteById(teamId);

        log.info("Team deleted: {}", teamId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeamResponse> getAllTeams(Pageable pageable) {
        log.info("Fetching all teams with pagination: {}", pageable);
        return teamRepository.findAll(pageable).map(this::mapToTeamResponse);
    }

    private TeamResponse mapToTeamResponse(Team team) {
        List<TeamResponse.TeamMemberDTO> members = team.getMembers()
                .stream()
                .map(this::mapToTeamMemberDTO)
                .collect(Collectors.toList());

        return TeamResponse.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .memberCount(team.getMemberCount())
                .members(members)
                .createdAt(team.getCreatedAt())
                .updatedAt(team.getUpdatedAt())
                .build();
    }

    private TeamResponse.TeamMemberDTO mapToTeamMemberDTO(TeamMember member) {
        return TeamResponse.TeamMemberDTO.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .firstName(member.getUser().getFirstName())
                .lastName(member.getUser().getLastName())
                .email(member.getUser().getEmail())
                .profilePhotoUrl(member.getUser().getProfilePhotoUrl())
                .role(member.getRole())
                .position(member.getPosition())
                .joinedAt(member.getJoinedAt())
                .build();
    }

    private boolean isValidRole(String role) {
        if (role == null) return false;
        String r = role.toUpperCase();
        return r.equals("FOUNDER") || r.equals("CO-FOUNDER") || r.equals("COFOUNDER") 
            || r.equals("DEVELOPER") || r.equals("DESIGNER") || r.equals("MARKETING") 
            || r.equals("BUSINESS") || r.equals("ADVISOR") || r.equals("INVESTOR") 
            || r.equals("LEAD") || r.equals("MEMBER");
    }
}
