package com.startupsync.team.repository;

import com.startupsync.team.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, String> {

    @Query("SELECT tm FROM TeamMember tm WHERE tm.team.id = :teamId")
    List<TeamMember> findByTeamId(@Param("teamId") String teamId);

    @Query("SELECT tm FROM TeamMember tm WHERE tm.team.id = :teamId AND tm.user.id = :userId")
    Optional<TeamMember> findByTeamIdAndUserId(@Param("teamId") String teamId, @Param("userId") String userId);

    @Query("SELECT tm FROM TeamMember tm WHERE tm.user.id = :userId")
    List<TeamMember> findByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.team.id = :teamId")
    long countByTeamId(@Param("teamId") String teamId);

    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.team.startup.id IN :startupIds AND tm.joinedAt <= :end")
    long countByStartupIdsAndJoinedAtBefore(@Param("startupIds") List<String> startupIds, @Param("end") java.time.LocalDateTime end);

    @Query("SELECT COUNT(tm) FROM TeamMember tm WHERE tm.user.id = :userId AND tm.joinedAt <= :end")
    long countByUserIdAndJoinedAtBefore(@Param("userId") String userId, @Param("end") java.time.LocalDateTime end);
}
