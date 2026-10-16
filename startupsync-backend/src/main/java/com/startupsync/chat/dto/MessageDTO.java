package com.startupsync.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageDTO {

    private String id;
    private String chatRoomId;
    private SenderDTO sender;
    private String content;
    private String messageType;
    private LocalDateTime createdAt;
    private LocalDateTime editedAt;
    private Boolean isEdited;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SenderDTO {
        private String id;
        private String firstName;
        private String lastName;
        private String profilePhotoUrl;
    }
}
