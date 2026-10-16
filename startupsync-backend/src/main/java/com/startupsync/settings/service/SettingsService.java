package com.startupsync.settings.service;

import com.startupsync.settings.dto.UserSettingsDto;

public interface SettingsService {
    UserSettingsDto getSettings(String userId);
    UserSettingsDto updateSettings(String userId, UserSettingsDto dto);
}
