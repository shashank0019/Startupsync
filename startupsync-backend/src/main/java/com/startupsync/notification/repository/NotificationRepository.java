package com.startupsync.notification.repository;

import com.startupsync.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, String> {

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    Page<Notification> findByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.isRead = false ORDER BY n.createdAt DESC")
    Page<Notification> findUnreadByUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId ORDER BY n.createdAt DESC")
    List<Notification> findAllByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user.id = :userId AND n.isRead = false")
    long countUnreadByUserId(@Param("userId") String userId);

    @Query("SELECT n FROM Notification n WHERE n.user.id = :userId AND n.notificationType = :type ORDER BY n.createdAt DESC")
    List<Notification> findByUserIdAndType(@Param("userId") String userId, @Param("type") String type);
}
