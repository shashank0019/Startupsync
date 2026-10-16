package com.startupsync.application.dto;

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
public class ApplicationReviewRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "^(ACCEPTED|REJECTED)$", message = "Status must be ACCEPTED or REJECTED")
    private String status;

    @Size(max = 1000, message = "Reason must not exceed 1000 characters")
    private String reason;
}
