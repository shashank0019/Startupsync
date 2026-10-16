package com.startupsync.application.repository;

import com.startupsync.application.entity.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, String> {

    @Query("SELECT a FROM Application a WHERE a.applicant.id = :applicantId ORDER BY a.appliedAt DESC")
    List<Application> findByApplicantId(@Param("applicantId") String applicantId);

    @Query("SELECT a FROM Application a WHERE a.applicant.id = :applicantId ORDER BY a.appliedAt DESC")
    Page<Application> findByApplicantId(@Param("applicantId") String applicantId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.startup.id = :startupId ORDER BY a.appliedAt DESC")
    List<Application> findByStartupId(@Param("startupId") String startupId);

    @Query("SELECT a FROM Application a WHERE a.startup.id = :startupId ORDER BY a.appliedAt DESC")
    Page<Application> findByStartupId(@Param("startupId") String startupId, Pageable pageable);

    @Query("SELECT a FROM Application a WHERE a.startup.id = :startupId AND a.status = :status ORDER BY a.appliedAt DESC")
    List<Application> findByStartupIdAndStatus(@Param("startupId") String startupId, @Param("status") String status);

    @Query("SELECT a FROM Application a WHERE a.applicant.id = :applicantId AND a.startup.id = :startupId")
    Optional<Application> findByApplicantIdAndStartupId(@Param("applicantId") String applicantId, @Param("startupId") String startupId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.startup.id = :startupId AND a.status = 'PENDING'")
    long countPendingByStartupId(@Param("startupId") String startupId);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.startup.id = :startupId AND a.status = 'APPROVED'")
    long countAcceptedByStartupId(@Param("startupId") String startupId);

    @Query("SELECT a FROM Application a WHERE a.status = 'PENDING' ORDER BY a.appliedAt DESC")
    Page<Application> findAllPending(Pageable pageable);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.applicant.id = :applicantId AND a.appliedAt BETWEEN :start AND :end")
    long countByApplicantIdAndAppliedAtBetween(@Param("applicantId") String applicantId,
                                               @Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(a) FROM Application a WHERE a.startup.id = :startupId AND a.appliedAt BETWEEN :start AND :end")
    long countByStartupIdAndAppliedAtBetween(@Param("startupId") String startupId,
                                             @Param("start") LocalDateTime start,
                                             @Param("end") LocalDateTime end);
}
