package com.startupsync.task.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskUpdateRequest {

    private String title;
    private String description;

    @Pattern(regexp = "^(TODO|IN_PROGRESS|REVIEW|COMPLETED)$", message = "Status must be TODO, IN_PROGRESS, REVIEW, or COMPLETED")
    private String status;

    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|URGENT)$", message = "Priority must be LOW, MEDIUM, HIGH, or URGENT")
    private String priority;

    @Min(value = 0, message = "Completion percentage must be at least 0")
    @Max(value = 100, message = "Completion percentage must not exceed 100")
    private Integer completionPercentage;

    private String assignedToUserId;

    private String sprintName;
}
