package com.startupsync.task.controller;

import com.startupsync.task.dto.TaskCreateRequest;
import com.startupsync.task.dto.TaskResponse;
import com.startupsync.task.dto.TaskUpdateRequest;
import com.startupsync.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@Slf4j
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable String startupId,
            Authentication authentication,
            @Valid @RequestBody TaskCreateRequest request) {

        log.info("Create task endpoint called for startup: {} by user: {}", startupId, authentication.getName());

        String userId = authentication.getName();
        TaskResponse response = taskService.createTask(startupId, userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my-tasks")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TaskResponse>> getMyTasks(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get my tasks endpoint called for user: {}", authentication.getName());

        String userId = authentication.getName();
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskResponse> tasks = taskService.getTasksAssignedToUser(userId, pageable);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/my-tasks/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskResponse>> getMyTasksByStatus(
            @PathVariable String status,
            Authentication authentication) {

        log.info("Get my tasks by status endpoint called - Status: {}", status);

        String userId = authentication.getName();
        List<TaskResponse> tasks = taskService.getUserTasksByStatus(userId, status);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TaskResponse>> getTasksByStartup(
            @PathVariable String startupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Get tasks by startup endpoint called - Startup: {}", startupId);

        Pageable pageable = PageRequest.of(page, size);
        Page<TaskResponse> tasks = taskService.getTasksByStartup(startupId, pageable);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/startup/{startupId}/status/{status}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TaskResponse>> getTasksByStatus(
            @PathVariable String startupId,
            @PathVariable String status) {

        log.info("Get tasks by status endpoint called - Startup: {}, Status: {}", startupId, status);

        List<TaskResponse> tasks = taskService.getTasksByStatus(startupId, status);

        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> getTask(@PathVariable String taskId) {

        log.info("Get task endpoint called - ID: {}", taskId);

        TaskResponse response = taskService.getTaskById(taskId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable String taskId,
            Authentication authentication,
            @Valid @RequestBody TaskUpdateRequest request) {

        log.info("Update task endpoint called - ID: {} by user: {}", taskId, authentication.getName());

        String userId = authentication.getName();
        TaskResponse response = taskService.updateTask(taskId, userId, request);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/status")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            @PathVariable String taskId,
            @RequestParam String status,
            Authentication authentication) {

        log.info("Update task status endpoint called - ID: {}, Status: {}", taskId, status);

        String userId = authentication.getName();
        TaskResponse response = taskService.updateTaskStatus(taskId, userId, status);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{taskId}/assign")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TaskResponse> assignTask(
            @PathVariable String taskId,
            @RequestParam String assignToUserId,
            Authentication authentication) {

        log.info("Assign task endpoint called - ID: {}, Assign To: {}", taskId, assignToUserId);

        String userId = authentication.getName();
        TaskResponse response = taskService.assignTask(taskId, userId, assignToUserId);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteTask(
            @PathVariable String taskId,
            Authentication authentication) {

        log.info("Delete task endpoint called - ID: {} by user: {}", taskId, authentication.getName());

        String userId = authentication.getName();
        taskService.deleteTask(taskId, userId);

        return ResponseEntity.noContent().build();
    }
}
