package com.startupsync.activity.repository;

import com.startupsync.activity.entity.ActivityEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityRepository extends JpaRepository<ActivityEvent, String> {

    @Query("SELECT a FROM ActivityEvent a WHERE a.user.id = :userId ORDER BY a.createdAt DESC")
    Page<ActivityEvent> findByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT a FROM ActivityEvent a WHERE a.user.id = :userId AND a.activityType = :activityType ORDER BY a.createdAt DESC")
    Page<ActivityEvent> findByUserIdAndActivityType(@Param("userId") String userId, @Param("activityType") String activityType, Pageable pageable);

    @Query("SELECT a FROM ActivityEvent a WHERE a.entityType = :entityType AND a.entityId = :entityId ORDER BY a.createdAt DESC")
    Page<ActivityEvent> findByEntityTypeAndEntityId(@Param("entityType") String entityType, @Param("entityId") String entityId, Pageable pageable);

    @Query("SELECT a FROM ActivityEvent a WHERE a.entityType = :entityType AND a.entityId = :entityId AND a.activityType = :activityType ORDER BY a.createdAt DESC")
    Page<ActivityEvent> findByEntityTypeAndEntityIdAndActivityType(@Param("entityType") String entityType, @Param("entityId") String entityId, @Param("activityType") String activityType, Pageable pageable);

    long countByUserId(String userId);
}
