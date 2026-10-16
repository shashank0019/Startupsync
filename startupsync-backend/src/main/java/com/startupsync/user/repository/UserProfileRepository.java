package com.startupsync.user.repository;

import com.startupsync.user.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, String> {

    Optional<UserProfile> findByUserId(String userId);

    @Query("SELECT up FROM UserProfile up WHERE up.user.id = :userId")
    Optional<UserProfile> findProfileByUserId(@Param("userId") String userId);

    @Query("SELECT COUNT(up) FROM UserProfile up WHERE up.completionPercentage >= 70")
    long countCompleteProfiles();
}
