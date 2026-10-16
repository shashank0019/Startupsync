package com.startupsync.chat.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageRequest {

    @NotBlank(message = "Chat room ID is required")
    private String chatRoomId;

    @NotBlank(message = "Message content is required")
    private String content;

    private String messageType;
}
