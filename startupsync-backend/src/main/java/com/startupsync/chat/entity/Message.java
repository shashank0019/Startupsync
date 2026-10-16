package com.startupsync.chat.entity;

import com.startupsync.auth.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "messages", indexes = {
        @Index(name = "idx_message_chat_room_id", columnList = "chat_room_id"),
        @Index(name = "idx_message_sender_id", columnList = "sender_id"),
        @Index(name = "idx_message_created_at", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "message_type", length = 50)
    private String messageType; // TEXT, IMAGE, FILE

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "is_edited", nullable = false)
    private Boolean isEdited;

    @Column(name = "edited_at")
    private LocalDateTime editedAt;

    @PrePersist
    protected void onCreate() {
        if (this.id == null) {
            this.id = UUID.randomUUID().toString();
        }
        if (this.messageType == null) {
            this.messageType = "TEXT";
        }
        if (this.isEdited == null) {
            this.isEdited = false;
        }
    }
}
