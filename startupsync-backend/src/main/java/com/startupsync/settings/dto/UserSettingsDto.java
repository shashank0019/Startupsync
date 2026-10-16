package com.startupsync.settings.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettingsDto {
    private Boolean emailNotifications;
    private Boolean applicationUpdates;
    private Boolean messageNotifications;
    private Boolean profileVisible;
    private Boolean showLocation;
    private Boolean allowMessaging;

    @NotBlank
    private String theme;

    @NotBlank
    private String language;
}
