package com.startupsync.invitation.repository;

import com.startupsync.invitation.entity.Invitation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, String> {

    @Query("SELECT i FROM Invitation i WHERE i.invitedUser.id = :userId ORDER BY i.createdAt DESC")
    List<Invitation> findByInvitedUserId(@Param("userId") String userId);

    @Query("SELECT i FROM Invitation i WHERE i.invitedUser.id = :userId ORDER BY i.createdAt DESC")
    Page<Invitation> findByInvitedUserId(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT i FROM Invitation i WHERE i.startup.id = :startupId ORDER BY i.createdAt DESC")
    List<Invitation> findByStartupId(@Param("startupId") String startupId);

    @Query("SELECT i FROM Invitation i WHERE i.startup.id = :startupId ORDER BY i.createdAt DESC")
    Page<Invitation> findByStartupId(@Param("startupId") String startupId, Pageable pageable);

    @Query("SELECT i FROM Invitation i WHERE i.startup.id = :startupId AND i.status = :status ORDER BY i.createdAt DESC")
    List<Invitation> findByStartupIdAndStatus(@Param("startupId") String startupId, @Param("status") String status);

    @Query("SELECT i FROM Invitation i WHERE i.invitedUser.id = :userId AND i.status = 'PENDING' ORDER BY i.createdAt DESC")
    Page<Invitation> findPendingInvitations(@Param("userId") String userId, Pageable pageable);

    @Query("SELECT i FROM Invitation i WHERE i.startup.id = :startupId AND i.invitedUser.id = :userId")
    Optional<Invitation> findByStartupIdAndInvitedUserId(@Param("startupId") String startupId, @Param("userId") String userId);

    @Query("SELECT COUNT(i) FROM Invitation i WHERE i.startup.id = :startupId AND i.status = 'PENDING'")
    long countPendingByStartupId(@Param("startupId") String startupId);

    @Query("SELECT COUNT(i) FROM Invitation i WHERE i.invitedUser.id = :userId AND i.status = 'PENDING'")
    long countPendingByUserId(@Param("userId") String userId);
}
