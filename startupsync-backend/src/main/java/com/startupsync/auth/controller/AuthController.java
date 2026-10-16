package com.startupsync.auth.controller;

import com.startupsync.auth.dto.AuthResponse;
import com.startupsync.auth.dto.ChangePasswordRequest;
import com.startupsync.auth.dto.ForgotPasswordRequest;
import com.startupsync.auth.dto.LoginRequest;
import com.startupsync.auth.dto.RegisterRequest;
import com.startupsync.auth.dto.ResetPasswordRequest;
import com.startupsync.auth.dto.VerifyEmailRequest;
import com.startupsync.auth.dto.VerifyEmailResponse;
import com.startupsync.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@Slf4j
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        log.info("Register endpoint called for email: {}", registerRequest.getEmail());
        AuthResponse authResponse = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        log.info("Login endpoint called for email: {}", loginRequest.getEmail());
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestHeader("Authorization") String authHeader) {
        log.info("Refresh token endpoint called");

        // Extract token from Authorization header
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().build();
        }

        String refreshToken = authHeader.substring(7);
        AuthResponse authResponse = authService.refreshToken(refreshToken);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        log.info("Logout endpoint called");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            authService.logout(token);
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/send-verification-code")
    public ResponseEntity<Void> sendVerificationCode(@RequestParam String email) {
        log.info("Send verification code endpoint called for email: {}", email);
        authService.sendEmailVerificationCode(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-email")
    public ResponseEntity<VerifyEmailResponse> verifyEmail(@Valid @RequestBody VerifyEmailRequest verifyEmailRequest) {
        log.info("Verify email endpoint called for email: {}", verifyEmailRequest.getEmail());
        VerifyEmailResponse response = authService.verifyEmail(verifyEmailRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody(required = false) ForgotPasswordRequest request,
            @RequestParam(required = false) String email) {
        String targetEmail = (request != null && request.getEmail() != null) ? request.getEmail() : email;
        if (targetEmail == null || targetEmail.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        log.info("Forgot password endpoint called for email: {}", targetEmail);
        authService.forgotPassword(targetEmail.trim());
        return ResponseEntity.ok(Map.of("message", "Password reset verification code sent to your email"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Reset password endpoint called for email: {}", request.getEmail());
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
    }
}
