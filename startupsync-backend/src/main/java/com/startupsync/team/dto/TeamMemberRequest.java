package com.startupsync.team.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeamMemberRequest {

    @NotBlank(message = "User ID is required")
    private String userId;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "^(FOUNDER|LEAD|MEMBER)$", message = "Role must be FOUNDER, LEAD, or MEMBER")
    private String role;

    @Size(max = 100, message = "Position must not exceed 100 characters")
    private String position;
}
