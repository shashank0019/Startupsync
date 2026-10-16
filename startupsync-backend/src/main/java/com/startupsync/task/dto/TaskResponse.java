package com.startupsync.task.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskResponse {

    private String id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private Integer completionPercentage;
    private LocalDateTime dueDate;
    private AssigneeDTO assignedTo;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private String sprintName;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AssigneeDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String email;
        private String profilePhotoUrl;
    }
}
