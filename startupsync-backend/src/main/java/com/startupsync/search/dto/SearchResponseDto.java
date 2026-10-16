package com.startupsync.search.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponseDto {
    private List<SearchItemDto> users;
    private List<SearchItemDto> startups;
    private List<SearchItemDto> tasks;
    private List<SearchItemDto> teams;
    private List<SearchItemDto> skills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SearchItemDto {
        private String id;
        private String title;
        private String subtitle;
        private String category; // USER, STARTUP, TASK, TEAM, SKILL
        private String url;
    }
}
