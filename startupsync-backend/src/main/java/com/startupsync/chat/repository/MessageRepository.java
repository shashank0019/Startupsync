package com.startupsync.chat.repository;

import com.startupsync.chat.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, String> {

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.createdAt DESC")
    Page<Message> findByChatRoomId(@Param("chatRoomId") String chatRoomId, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :chatRoomId ORDER BY m.createdAt DESC")
    List<Message> findAllByChatRoomId(@Param("chatRoomId") String chatRoomId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.chatRoom.id = :chatRoomId")
    long countByChatRoomId(@Param("chatRoomId") String chatRoomId);

    @Query("SELECT COUNT(m) FROM Message m WHERE m.sender.id = :senderId AND m.createdAt BETWEEN :start AND :end")
    long countBySenderIdAndCreatedAtBetween(@Param("senderId") String senderId,
                                            @Param("start") LocalDateTime start,
                                            @Param("end") LocalDateTime end);
}
