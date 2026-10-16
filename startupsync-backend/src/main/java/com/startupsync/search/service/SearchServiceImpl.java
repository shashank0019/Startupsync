package com.startupsync.search.service;

import com.startupsync.search.dto.SearchResponseDto;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.task.repository.TaskRepository;
import com.startupsync.team.repository.TeamRepository;
import com.startupsync.skill.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class SearchServiceImpl implements SearchService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Override
    public SearchResponseDto search(String query, String userId) {
        String trimmed = query != null ? query.trim() : "";
        if (trimmed.isEmpty()) {
            return SearchResponseDto.builder()
                    .users(List.of())
                    .startups(List.of())
                    .tasks(List.of())
                    .teams(List.of())
                    .skills(List.of())
                    .build();
        }

        List<SearchResponseDto.SearchItemDto> users = userRepository.searchUsers(trimmed).stream()
                .limit(10)
                .map(u -> SearchResponseDto.SearchItemDto.builder()
                        .id(u.getId())
                        .title(u.getFirstName() + " " + u.getLastName())
                        .subtitle(u.getEmail())
                        .category("USER")
                        .url("/profile")
                        .build())
                .collect(Collectors.toList());

        List<SearchResponseDto.SearchItemDto> startups = startupRepository.searchStartups(trimmed, PageRequest.of(0, 10)).stream()
                .map(s -> SearchResponseDto.SearchItemDto.builder()
                        .id(s.getId())
                        .title(s.getName())
                        .subtitle(s.getTagline())
                        .category("STARTUP")
                        .url("/startups/" + s.getId())
                        .build())
                .collect(Collectors.toList());

        List<SearchResponseDto.SearchItemDto> tasks = taskRepository.searchTasks(trimmed, userId).stream()
                .limit(10)
                .map(t -> SearchResponseDto.SearchItemDto.builder()
                        .id(t.getId())
                        .title(t.getTitle())
                        .subtitle(t.getStartup().getName())
                        .category("TASK")
                        .url("/tasks")
                        .build())
                .collect(Collectors.toList());

        List<SearchResponseDto.SearchItemDto> teams = teamRepository.searchTeams(trimmed).stream()
                .limit(10)
                .map(tm -> SearchResponseDto.SearchItemDto.builder()
                        .id(tm.getId())
                        .title(tm.getName())
                        .subtitle(tm.getDescription())
                        .category("TEAM")
                        .url("/teams")
                        .build())
                .collect(Collectors.toList());

        List<SearchResponseDto.SearchItemDto> skills = skillRepository.searchByName(trimmed).stream()
                .limit(10)
                .map(sk -> SearchResponseDto.SearchItemDto.builder()
                        .id(sk.getId())
                        .title(sk.getName())
                        .subtitle(sk.getCategory())
                        .category("SKILL")
                        .url("/profile/edit")
                        .build())
                .collect(Collectors.toList());

        return SearchResponseDto.builder()
                .users(users)
                .startups(startups)
                .tasks(tasks)
                .teams(teams)
                .skills(skills)
                .build();
    }
}
