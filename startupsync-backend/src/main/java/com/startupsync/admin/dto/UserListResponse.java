package com.startupsync.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserListResponse {

    private List<AdminUserDTO> users;

    private Integer totalCount;

    private Integer pageNumber;

    private Integer pageSize;

    private Integer totalPages;

    private Boolean hasNext;

    private Boolean hasPrevious;

    public static UserListResponseBuilder builder() {
        return new UserListResponseBuilder();
    }

    public static class UserListResponseBuilder {
        private List<AdminUserDTO> users;
        private Integer totalCount;
        private Integer pageNumber;
        private Integer pageSize;
        private Integer totalPages;
        private Boolean hasNext;
        private Boolean hasPrevious;

        UserListResponseBuilder() {}

        public UserListResponseBuilder users(List<AdminUserDTO> users) {
            this.users = users;
            return this;
        }

        public UserListResponseBuilder totalCount(Integer totalCount) {
            this.totalCount = totalCount;
            return this;
        }

        public UserListResponseBuilder pageNumber(Integer pageNumber) {
            this.pageNumber = pageNumber;
            return this;
        }

        public UserListResponseBuilder pageSize(Integer pageSize) {
            this.pageSize = pageSize;
            return this;
        }

        public UserListResponseBuilder totalPages(Integer totalPages) {
            this.totalPages = totalPages;
            return this;
        }

        public UserListResponseBuilder hasNext(Boolean hasNext) {
            this.hasNext = hasNext;
            return this;
        }

        public UserListResponseBuilder hasPrevious(Boolean hasPrevious) {
            this.hasPrevious = hasPrevious;
            return this;
        }

        public UserListResponse build() {
            return new UserListResponse(users, totalCount, pageNumber, pageSize, totalPages, hasNext, hasPrevious);
        }
    }
}
