package com.startupsync.application.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ApplicationRequest {

    @Size(max = 2000, message = "Cover letter must not exceed 2000 characters")
    private String coverLetter;

    public ApplicationRequest(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getCoverLetter() { return this.coverLetter; }

    public static ApplicationRequestBuilder builder() {
        return new ApplicationRequestBuilder();
    }

    public static class ApplicationRequestBuilder {
        private String coverLetter;

        ApplicationRequestBuilder() {}

        public ApplicationRequestBuilder coverLetter(String coverLetter) {
            this.coverLetter = coverLetter;
            return this;
        }

        public ApplicationRequest build() {
            return new ApplicationRequest(coverLetter);
        }
    }
}
