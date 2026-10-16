package com.startupsync.task.service;

import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.exception.UnauthorizedException;
import com.startupsync.startup.entity.Startup;
import com.startupsync.startup.repository.StartupRepository;
import com.startupsync.task.dto.TaskCreateRequest;
import com.startupsync.task.dto.TaskResponse;
import com.startupsync.task.dto.TaskUpdateRequest;
import com.startupsync.task.entity.Task;
import com.startupsync.task.repository.TaskRepository;
import com.startupsync.activity.service.ActivityService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@Transactional
public class TaskServiceImpl implements TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private StartupRepository startupRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityService activityService;

    @Override
    public TaskResponse createTask(String startupId, String userId, TaskCreateRequest request) {
        log.info("Creating task for startup: {} by user: {}", startupId, userId);

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found with ID: " + startupId));

        // Verify user is the founder
        if (!startup.getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can create tasks");
        }

        User assignedTo = null;
        if (StringUtils.hasText(request.getAssignedToUserId())) {
            assignedTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + request.getAssignedToUserId()));
        }

        Task task = Task.builder()
                .startup(startup)
                .title(request.getTitle())
                .description(request.getDescription())
                .priority(request.getPriority() != null ? request.getPriority() : "MEDIUM")
                .status("TODO")
                .completionPercentage(0)
                .dueDate(request.getDueDate())
                .assignedTo(assignedTo)
                .createdBy(userId)
                .build();

        task = taskRepository.save(task);
        log.info("Task created successfully: {}", task.getId());
        activityService.recordActivity(userId, "Task Created", "Created task: " + task.getTitle() + " for startup " + startup.getName(), "TASK_CREATED", "STARTUP", startup.getId());
        if (assignedTo != null) {
            activityService.recordActivity(assignedTo.getId(), "Task Assigned", "Assigned task: " + task.getTitle() + " for startup " + startup.getName(), "TASK_ASSIGNED", "STARTUP", startup.getId());
        }

        return mapToTaskResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTaskById(String taskId) {
        log.debug("Fetching task: {}", taskId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        return mapToTaskResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksByStartup(String startupId, Pageable pageable) {
        log.debug("Fetching tasks for startup: {}", startupId);

        return taskRepository.findByStartupId(startupId, pageable)
                .map(this::mapToTaskResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasksAssignedToUser(String userId, Pageable pageable) {
        log.debug("Fetching tasks assigned to user: {}", userId);

        return taskRepository.findByAssignedTo(userId, pageable)
                .map(this::mapToTaskResponse);
    }

    @Override
    public TaskResponse updateTask(String taskId, String userId, TaskUpdateRequest request) {
        log.info("Updating task: {} by user: {}", taskId, userId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Verify user is the founder or assignee
        if (!task.getStartup().getFounder().getId().equals(userId) && 
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(userId))) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }

        if (StringUtils.hasText(request.getTitle())) {
            task.setTitle(request.getTitle());
        }

        if (StringUtils.hasText(request.getDescription())) {
            task.setDescription(request.getDescription());
        }

        if (StringUtils.hasText(request.getStatus())) {
            if (!isValidStatus(request.getStatus())) {
                throw new BadRequestException("Invalid status: " + request.getStatus());
            }
            task.setStatus(request.getStatus());

            if ("COMPLETED".equalsIgnoreCase(request.getStatus())) {
                task.setCompletedAt(LocalDateTime.now());
                task.setCompletionPercentage(100);
            }
        }

        if (StringUtils.hasText(request.getPriority())) {
            if (!isValidPriority(request.getPriority())) {
                throw new BadRequestException("Invalid priority: " + request.getPriority());
            }
            task.setPriority(request.getPriority());
        }

        if (request.getCompletionPercentage() != null) {
            task.setCompletionPercentage(request.getCompletionPercentage());
        }

        if (StringUtils.hasText(request.getAssignedToUserId())) {
            User assignedTo = userRepository.findById(request.getAssignedToUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));
            task.setAssignedTo(assignedTo);
        }

        boolean isCompleted = "COMPLETED".equalsIgnoreCase(task.getStatus());
        task = taskRepository.save(task);
        log.info("Task updated successfully: {}", taskId);
        if (isCompleted) {
            activityService.recordActivity(userId, "Task Completed", "Completed task: " + task.getTitle(), "TASK_COMPLETED", "STARTUP", task.getStartup().getId());
            if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(userId)) {
                activityService.recordActivity(task.getAssignedTo().getId(), "Task Completed", "Completed task: " + task.getTitle(), "TASK_COMPLETED", "STARTUP", task.getStartup().getId());
            }
        }

        return mapToTaskResponse(task);
    }

    @Override
    public TaskResponse updateTaskStatus(String taskId, String userId, String status) {
        log.info("Updating task status: {} to: {}", taskId, status);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Verify user is the founder or assignee
        if (!task.getStartup().getFounder().getId().equals(userId) &&
            (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(userId))) {
            throw new UnauthorizedException("You don't have permission to update this task");
        }

        if (!isValidStatus(status)) {
            throw new BadRequestException("Invalid status: " + status);
        }

        task.setStatus(status);

        if ("COMPLETED".equalsIgnoreCase(status)) {
            task.setCompletedAt(LocalDateTime.now());
            task.setCompletionPercentage(100);
        }

        boolean isCompleted = "COMPLETED".equalsIgnoreCase(status);
        task = taskRepository.save(task);
        log.info("Task status updated: {}", taskId);
        if (isCompleted) {
            activityService.recordActivity(userId, "Task Completed", "Completed task: " + task.getTitle(), "TASK_COMPLETED", "STARTUP", task.getStartup().getId());
            if (task.getAssignedTo() != null && !task.getAssignedTo().getId().equals(userId)) {
                activityService.recordActivity(task.getAssignedTo().getId(), "Task Completed", "Completed task: " + task.getTitle(), "TASK_COMPLETED", "STARTUP", task.getStartup().getId());
            }
        }

        return mapToTaskResponse(task);
    }

    @Override
    public TaskResponse assignTask(String taskId, String userId, String assignToUserId) {
        log.info("Assigning task: {} to user: {} by user: {}", taskId, assignToUserId, userId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Verify user is the founder
        if (!task.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can assign tasks");
        }

        User assignedTo = userRepository.findById(assignToUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + assignToUserId));

        task.setAssignedTo(assignedTo);
        task = taskRepository.save(task);

        log.info("Task assigned successfully: {}", taskId);
        activityService.recordActivity(userId, "Task Assigned", "Assigned task: " + task.getTitle() + " to " + assignedTo.getFirstName() + " " + assignedTo.getLastName(), "TASK_ASSIGNED", "STARTUP", task.getStartup().getId());
        activityService.recordActivity(assignToUserId, "Task Assigned", "You were assigned task: " + task.getTitle(), "TASK_ASSIGNED", "STARTUP", task.getStartup().getId());

        return mapToTaskResponse(task);
    }

    @Override
    public void deleteTask(String taskId, String userId) {
        log.info("Deleting task: {} by user: {}", taskId, userId);

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        // Verify user is the founder
        if (!task.getStartup().getFounder().getId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can delete tasks");
        }

        taskRepository.deleteById(taskId);

        log.info("Task deleted: {}", taskId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByStatus(String startupId, String status) {
        log.debug("Fetching tasks for startup: {} with status: {}", startupId, status);

        return taskRepository.findByStartupIdAndStatus(startupId, status)
                .stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getUserTasksByStatus(String userId, String status) {
        log.debug("Fetching tasks for user: {} with status: {}", userId, status);

        return taskRepository.findByAssignedToAndStatus(userId, status)
                .stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus())
                .priority(task.getPriority())
                .completionPercentage(task.getCompletionPercentage())
                .dueDate(task.getDueDate())
                .assignedTo(task.getAssignedTo() != null ? TaskResponse.AssigneeDTO.builder()
                        .id(task.getAssignedTo().getId())
                        .firstName(task.getAssignedTo().getFirstName())
                        .lastName(task.getAssignedTo().getLastName())
                        .email(task.getAssignedTo().getEmail())
                        .profilePhotoUrl(task.getAssignedTo().getProfilePhotoUrl())
                        .build() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .completedAt(task.getCompletedAt())
                .build();
    }

    private boolean isValidStatus(String status) {
        return status != null && (status.equalsIgnoreCase("TODO") || status.equalsIgnoreCase("IN_PROGRESS") ||
                status.equalsIgnoreCase("REVIEW") || status.equalsIgnoreCase("COMPLETED"));
    }

    private boolean isValidPriority(String priority) {
        return priority != null && (priority.equalsIgnoreCase("LOW") || priority.equalsIgnoreCase("MEDIUM") ||
                priority.equalsIgnoreCase("HIGH") || priority.equalsIgnoreCase("URGENT"));
    }
}
