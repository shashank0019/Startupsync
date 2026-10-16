package com.startupsync.auth.service;

import com.startupsync.auth.dto.AuthResponse;
import com.startupsync.auth.dto.ChangePasswordRequest;
import com.startupsync.auth.dto.LoginRequest;
import com.startupsync.auth.dto.RegisterRequest;
import com.startupsync.auth.dto.ResetPasswordRequest;
import com.startupsync.auth.dto.VerifyEmailRequest;
import com.startupsync.auth.dto.VerifyEmailResponse;

public interface AuthService {

    /**
     * Register a new user
     * @param registerRequest containing user registration details
     * @return AuthResponse with tokens and user info
     */
    AuthResponse register(RegisterRequest registerRequest);

    /**
     * Authenticate user and generate tokens
     * @param loginRequest containing email and password
     * @return AuthResponse with tokens and user info
     */
    AuthResponse login(LoginRequest loginRequest);

    /**
     * Refresh access token using refresh token
     * @param refreshToken the refresh token
     * @return AuthResponse with new access token
     */
    AuthResponse refreshToken(String refreshToken);

    /**
     * Logout user (invalidate tokens)
     * @param token the access token to invalidate
     */
    void logout(String token);

    /**
     * Send email verification code to user's email
     * @param email the user's email address
     */
    void sendEmailVerificationCode(String email);

    /**
     * Verify email using verification code
     * @param verifyEmailRequest containing email and verification code
     * @return VerifyEmailResponse with verification status
     */
    VerifyEmailResponse verifyEmail(VerifyEmailRequest verifyEmailRequest);

    void changePassword(String userId, ChangePasswordRequest request);

    void forgotPassword(String email);

    void resetPassword(ResetPasswordRequest request);
}
