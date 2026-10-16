package com.startupsync.chat.repository;

import com.startupsync.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.id = :id AND cr.isActive = true")
    Optional<ChatRoom> findByIdActive(@Param("id") String id);

    @Query("SELECT cr FROM ChatRoom cr JOIN cr.participants p WHERE p.id = :userId AND cr.isActive = true ORDER BY cr.updatedAt DESC")
    List<ChatRoom> findByParticipantId(@Param("userId") String userId);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.roomType = 'ONE_TO_ONE' AND SIZE(cr.participants) = 2 " +
            "AND EXISTS (SELECT 1 FROM cr.participants p WHERE p.id = :userId1) " +
            "AND EXISTS (SELECT 1 FROM cr.participants p WHERE p.id = :userId2)")
    Optional<ChatRoom> findOneToOneChatRoom(@Param("userId1") String userId1, @Param("userId2") String userId2);
}
