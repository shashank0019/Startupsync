package com.startupsync.task.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    private String description;

    @Pattern(regexp = "^(LOW|MEDIUM|HIGH|URGENT)$", message = "Priority must be LOW, MEDIUM, HIGH, or URGENT")
    private String priority;

    private LocalDateTime dueDate;

    private String assignedToUserId;

    private String sprintName;
}
