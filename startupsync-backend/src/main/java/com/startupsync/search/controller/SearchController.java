package com.startupsync.search.controller;

import com.startupsync.search.dto.SearchResponseDto;
import com.startupsync.search.service.SearchService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/search")
@Slf4j
public class SearchController {

    @Autowired
    private SearchService searchService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<SearchResponseDto> search(
            @RequestParam String query,
            Authentication authentication) {
        log.info("Global search query: '{}' by user: {}", query, authentication.getName());
        String userId = authentication.getName();
        return ResponseEntity.ok(searchService.search(query, userId));
    }
}
