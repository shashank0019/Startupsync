package com.startupsync.task.service;

import com.startupsync.task.dto.TaskCreateRequest;
import com.startupsync.task.dto.TaskResponse;
import com.startupsync.task.dto.TaskUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TaskService {

    /**
     * Create a new task
     */
    TaskResponse createTask(String startupId, String userId, TaskCreateRequest request);

    /**
     * Get task by ID
     */
    TaskResponse getTaskById(String taskId);

    /**
     * Get all tasks for a startup
     */
    Page<TaskResponse> getTasksByStartup(String startupId, Pageable pageable);

    /**
     * Get all tasks assigned to a user
     */
    Page<TaskResponse> getTasksAssignedToUser(String userId, Pageable pageable);

    /**
     * Update task
     */
    TaskResponse updateTask(String taskId, String userId, TaskUpdateRequest request);

    /**
     * Update task status
     */
    TaskResponse updateTaskStatus(String taskId, String userId, String status);

    /**
     * Assign task to user
     */
    TaskResponse assignTask(String taskId, String userId, String assignToUserId);

    /**
     * Delete task
     */
    void deleteTask(String taskId, String userId);

    /**
     * Get tasks by status
     */
    List<TaskResponse> getTasksByStatus(String startupId, String status);

    /**
     * Get tasks assigned to user by status
     */
    List<TaskResponse> getUserTasksByStatus(String userId, String status);
}
