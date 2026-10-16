package com.startupsync.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class UserActionResponse {

    private String userId;

    private String message;

    private String status;

    private LocalDateTime timestamp;

    public UserActionResponse(String userId, String message, String status, LocalDateTime timestamp) {
        this.userId = userId;
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }

    public static UserActionResponseBuilder builder() {
        return new UserActionResponseBuilder();
    }

    public static class UserActionResponseBuilder {
        private String userId;
        private String message;
        private String status;
        private LocalDateTime timestamp;

        UserActionResponseBuilder() {}

        public UserActionResponseBuilder userId(String userId) {
            this.userId = userId;
            return this;
        }

        public UserActionResponseBuilder message(String message) {
            this.message = message;
            return this;
        }

        public UserActionResponseBuilder status(String status) {
            this.status = status;
            return this;
        }

        public UserActionResponseBuilder timestamp(LocalDateTime timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public UserActionResponse build() {
            return new UserActionResponse(userId, message, status, timestamp);
        }
    }
}
