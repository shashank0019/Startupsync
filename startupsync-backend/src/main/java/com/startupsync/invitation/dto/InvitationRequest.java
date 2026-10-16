package com.startupsync.invitation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvitationRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;

    @Size(max = 1000, message = "Message must not exceed 1000 characters")
    private String message;
}
