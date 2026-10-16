package com.startupsync.team.repository;

import com.startupsync.team.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {

    @Query("SELECT t FROM Team t WHERE t.startup.id = :startupId")
    List<Team> findByStartupId(@Param("startupId") String startupId);

    @Query("SELECT t FROM Team t WHERE t.startup.id = :startupId AND t.createdBy = :userId")
    Optional<Team> findByStartupIdAndCreatedBy(@Param("startupId") String startupId, @Param("userId") String userId);

    @Query("SELECT t FROM Team t WHERE t.createdBy = :userId")
    List<Team> findByCreatedBy(@Param("userId") String userId);

    @Query("SELECT COUNT(t) FROM Team t WHERE t.startup.id = :startupId")
    long countByStartupId(@Param("startupId") String startupId);

    @Query("SELECT t FROM Team t WHERE LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Team> searchTeams(@Param("query") String query);
}
