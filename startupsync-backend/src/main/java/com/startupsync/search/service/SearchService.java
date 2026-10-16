package com.startupsync.search.service;

import com.startupsync.search.dto.SearchResponseDto;

public interface SearchService {
    SearchResponseDto search(String query, String userId);
}
