package com.startupsync.admin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActionRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    private String reason;
}
