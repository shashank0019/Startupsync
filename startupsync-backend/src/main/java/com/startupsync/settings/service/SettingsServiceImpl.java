package com.startupsync.settings.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.settings.dto.UserSettingsDto;
import com.startupsync.settings.entity.UserSettings;
import com.startupsync.settings.repository.UserSettingsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@Transactional
public class SettingsServiceImpl implements SettingsService {

    @Autowired
    private UserSettingsRepository settingsRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserSettingsDto getSettings(String userId) {
        return toDto(getOrCreate(userId));
    }

    @Override
    public UserSettingsDto updateSettings(String userId, UserSettingsDto dto) {
        UserSettings settings = getOrCreate(userId);

        if (dto.getEmailNotifications() != null) settings.setEmailNotifications(dto.getEmailNotifications());
        if (dto.getApplicationUpdates() != null) settings.setApplicationUpdates(dto.getApplicationUpdates());
        if (dto.getMessageNotifications() != null) settings.setMessageNotifications(dto.getMessageNotifications());
        if (dto.getProfileVisible() != null) settings.setProfileVisible(dto.getProfileVisible());
        if (dto.getShowLocation() != null) settings.setShowLocation(dto.getShowLocation());
        if (dto.getAllowMessaging() != null) settings.setAllowMessaging(dto.getAllowMessaging());
        if (dto.getTheme() != null) settings.setTheme(dto.getTheme());
        if (dto.getLanguage() != null) settings.setLanguage(dto.getLanguage());

        return toDto(settingsRepository.save(settings));
    }

    private UserSettings getOrCreate(String userId) {
        return settingsRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            return settingsRepository.save(UserSettings.builder().user(user).build());
        });
    }

    private UserSettingsDto toDto(UserSettings settings) {
        return UserSettingsDto.builder()
                .emailNotifications(settings.getEmailNotifications())
                .applicationUpdates(settings.getApplicationUpdates())
                .messageNotifications(settings.getMessageNotifications())
                .profileVisible(settings.getProfileVisible())
                .showLocation(settings.getShowLocation())
                .allowMessaging(settings.getAllowMessaging())
                .theme(settings.getTheme())
                .language(settings.getLanguage())
                .build();
    }
}
