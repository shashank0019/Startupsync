package com.startupsync.task.repository;

import com.startupsync.task.entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, String> {

    @Query("SELECT t FROM Task t WHERE t.startup.id = :startupId ORDER BY t.dueDate ASC, t.priority DESC")
    Page<Task> findByStartupId(@Param("startupId") String startupId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId ORDER BY t.dueDate ASC, t.priority DESC")
    Page<Task> findByAssignedTo(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT t FROM Task t WHERE t.startup.id = :startupId AND t.status = :status ORDER BY t.dueDate ASC")
    List<Task> findByStartupIdAndStatus(@Param("startupId") String startupId, @Param("status") String status);

    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.status = :status ORDER BY t.dueDate ASC")
    List<Task> findByAssignedToAndStatus(@Param("userId") String userId, @Param("status") String status);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.startup.id = :startupId AND t.status = 'COMPLETED'")
    long countCompletedByStartupId(@Param("startupId") String startupId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.startup.id = :startupId")
    long countByStartupId(@Param("startupId") String startupId);

    @Query("SELECT t FROM Task t WHERE t.startup.id = :startupId ORDER BY t.priority DESC, t.dueDate ASC")
    List<Task> findAllByStartupId(@Param("startupId") String startupId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status != 'COMPLETED'")
    long countPendingByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(t) FROM Task t WHERE t.assignedTo.id = :userId AND t.status = 'COMPLETED' AND t.completedAt BETWEEN :start AND :end")
    long countCompletedByUserIdAndDate(@Param("userId") String userId, @Param("start") java.time.LocalDateTime start, @Param("end") java.time.LocalDateTime end);

    @Query("SELECT t FROM Task t WHERE (LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND (t.assignedTo.id = :userId OR t.startup.founder.id = :userId)")
    List<Task> searchTasks(@Param("query") String query, @Param("userId") String userId);
}
