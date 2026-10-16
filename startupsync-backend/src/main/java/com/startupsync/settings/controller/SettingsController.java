package com.startupsync.settings.controller;

import com.startupsync.settings.dto.UserSettingsDto;
import com.startupsync.settings.service.SettingsService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/settings")
@Slf4j
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsDto> getSettings(Authentication authentication) {
        return ResponseEntity.ok(settingsService.getSettings(authentication.getName()));
    }

    @PutMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserSettingsDto> updateSettings(
            Authentication authentication,
            @Valid @RequestBody UserSettingsDto dto) {
        return ResponseEntity.ok(settingsService.updateSettings(authentication.getName(), dto));
    }
}
