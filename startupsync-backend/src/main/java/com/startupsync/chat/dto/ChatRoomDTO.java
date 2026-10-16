package com.startupsync.chat.dto;

import com.startupsync.auth.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoomDTO {
    private String id;
    private String name;
    private String description;
    private String roomType;
    private List<User> members;
    private MessageDTO lastMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
