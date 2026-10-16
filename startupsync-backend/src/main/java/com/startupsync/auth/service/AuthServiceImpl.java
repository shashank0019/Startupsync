package com.startupsync.auth.service;

import com.startupsync.auth.dto.AuthResponse;
import com.startupsync.auth.dto.ChangePasswordRequest;
import com.startupsync.auth.dto.LoginRequest;
import com.startupsync.auth.dto.RegisterRequest;
import com.startupsync.auth.dto.ResetPasswordRequest;
import com.startupsync.auth.dto.VerifyEmailRequest;
import com.startupsync.auth.dto.VerifyEmailResponse;
import com.startupsync.auth.entity.EmailVerificationToken;
import com.startupsync.auth.entity.Role;
import com.startupsync.auth.entity.User;
import com.startupsync.auth.repository.EmailVerificationTokenRepository;
import com.startupsync.auth.repository.RoleRepository;
import com.startupsync.auth.repository.UserRepository;
import com.startupsync.exception.BadRequestException;
import com.startupsync.exception.ResourceNotFoundException;
import com.startupsync.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private EmailVerificationTokenRepository emailVerificationTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private static final int VERIFICATION_CODE_LENGTH = 6;
    private static final long VERIFICATION_CODE_EXPIRY_MINUTES = 15;

    @Override
    public AuthResponse register(RegisterRequest registerRequest) {
        log.info("Registering user with email: {}", registerRequest.getEmail());

        // Validate passwords match
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Check if user already exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email already registered");
        }

        // Determine role (default to MEMBER if not specified)
        String roleName = registerRequest.getRole() != null ? registerRequest.getRole() : "MEMBER";
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        // Create new user
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(role);
        user.setIsEmailVerified(true); // Automatically verify user upon registration
        user.setIsActive(true);
        user.setProfileCompletionPercentage(20); // Initial 20% for basic info

        user = userRepository.save(user);
        log.info("User registered successfully: {} ({})", user.getEmail(), user.getId());

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail(), role.getName());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // Skip sending email verification code
        // sendEmailVerificationCode(user.getEmail());

        // Build response
        return buildAuthResponse(accessToken, refreshToken, user, role);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        log.info("Logging in user with email: {}", loginRequest.getEmail());

        // Find user by email
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Check if user is active
        if (!user.getIsActive()) {
            throw new BadRequestException("User account is inactive");
        }

        // Validate password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        user = userRepository.save(user);

        log.info("User logged in successfully: {}", user.getEmail());

        // Generate tokens
        String accessToken = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole().getName()
        );
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        // Build response
        return buildAuthResponse(accessToken, refreshToken, user, user.getRole());
    }

    @Override
    public AuthResponse refreshToken(String refreshToken) {
        log.info("Refreshing access token");

        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new BadRequestException("Invalid or expired refresh token");
        }

        String tokenType = jwtUtil.extractTokenType(refreshToken);
        if (!"REFRESH".equals(tokenType)) {
            throw new BadRequestException("Invalid token type");
        }

        String userId = jwtUtil.extractUserId(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.getIsActive()) {
            throw new BadRequestException("User account is inactive");
        }

        // Generate new access token
        String newAccessToken = jwtUtil.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getRole().getName()
        );

        log.info("Access token refreshed successfully for user: {}", userId);

        // Return response with new access token but same refresh token
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(user.getRole().getName());
        userDTO.setIsEmailVerified(user.getIsEmailVerified());
        userDTO.setIsActive(user.getIsActive());
        userDTO.setProfilePhotoUrl(user.getProfilePhotoUrl());
        userDTO.setProfileCompletionPercentage(user.getProfileCompletionPercentage());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtUtil.getExpirationTime() / 1000);
        response.setUser(userDTO);
        return response;
    }

    @Override
    public void logout(String token) {
        log.info("User logged out");
        // TODO: Implement token blacklisting if needed
        // For now, just rely on token expiration
    }

    @Override
    public void sendEmailVerificationCode(String email) {
        log.info("Sending email verification code to: {}", email);

        // Delete any existing unverified tokens for this email
        emailVerificationTokenRepository.findByEmail(email).ifPresent(token -> {
            if (!token.getIsVerified()) {
                emailVerificationTokenRepository.delete(token);
            }
        });

        // Generate verification code
        String verificationCode = generateVerificationCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES);

        // Create and save token
        EmailVerificationToken token = new EmailVerificationToken();
        token.setEmail(email);
        token.setVerificationCode(verificationCode);
        token.setIsVerified(false);
        token.setExpiresAt(expiresAt);

        emailVerificationTokenRepository.save(token);

        // TODO: Send email with verification code
        // For now, just log it
        log.info("Verification code for {}: {}", email, verificationCode);
    }

    @Override
    public VerifyEmailResponse verifyEmail(VerifyEmailRequest verifyEmailRequest) {
        log.info("Verifying email: {}", verifyEmailRequest.getEmail());

        // Find verification token
        EmailVerificationToken token = emailVerificationTokenRepository.findByVerificationCode(verifyEmailRequest.getVerificationCode())
                .orElseThrow(() -> new BadRequestException("Invalid verification code"));

        // Check if token is expired
        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            throw new BadRequestException("Verification code expired");
        }

        // Check if email matches
        if (!token.getEmail().equals(verifyEmailRequest.getEmail())) {
            throw new BadRequestException("Email does not match verification code");
        }

        // Mark token as verified
        token.setIsVerified(true);
        token.setVerifiedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(token);

        // Update user's email verification status
        User user = userRepository.findByEmail(verifyEmailRequest.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setIsEmailVerified(true);
        userRepository.save(user);

        log.info("Email verified successfully for: {}", verifyEmailRequest.getEmail());

        VerifyEmailResponse response = new VerifyEmailResponse();
        response.setSuccess(true);
        response.setMessage("Email verified successfully");
        response.setEmail(verifyEmailRequest.getEmail());
        return response;
    }

    @Override
    public void changePassword(String userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", userId);
    }

    @Override
    public void forgotPassword(String email) {
        log.info("Processing forgot password request for email: {}", email);

        // Ensure user exists
        userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with email: " + email));

        // Delete any existing tokens for this email
        emailVerificationTokenRepository.findByEmail(email).ifPresent(token -> {
            emailVerificationTokenRepository.delete(token);
        });

        // Generate verification code
        String verificationCode = generateVerificationCode();
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(VERIFICATION_CODE_EXPIRY_MINUTES);

        // Create and save token
        EmailVerificationToken token = new EmailVerificationToken();
        token.setEmail(email);
        token.setVerificationCode(verificationCode);
        token.setIsVerified(false);
        token.setExpiresAt(expiresAt);

        emailVerificationTokenRepository.save(token);

        log.info("Password reset OTP code for {}: {}", email, verificationCode);
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        log.info("Processing reset password for email: {}", request.getEmail());

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        // Find verification token
        EmailVerificationToken token = emailVerificationTokenRepository.findByVerificationCode(request.getVerificationCode())
                .orElseThrow(() -> new BadRequestException("Invalid or expired verification code"));

        if (LocalDateTime.now().isAfter(token.getExpiresAt())) {
            throw new BadRequestException("Verification code has expired");
        }

        if (!token.getEmail().equalsIgnoreCase(request.getEmail())) {
            throw new BadRequestException("Verification code does not match email");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + request.getEmail()));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        token.setIsVerified(true);
        token.setVerifiedAt(LocalDateTime.now());
        emailVerificationTokenRepository.save(token);

        log.info("Password successfully reset for user: {}", request.getEmail());
    }

    private String generateVerificationCode() {
        Random random = new Random();
        StringBuilder code = new StringBuilder();
        for (int i = 0; i < VERIFICATION_CODE_LENGTH; i++) {
            code.append(random.nextInt(10));
        }
        return code.toString();
    }

    private AuthResponse buildAuthResponse(String accessToken, String refreshToken, User user, Role role) {
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setFirstName(user.getFirstName());
        userDTO.setLastName(user.getLastName());
        userDTO.setEmail(user.getEmail());
        userDTO.setRole(role.getName());
        userDTO.setIsEmailVerified(user.getIsEmailVerified());
        userDTO.setIsActive(user.getIsActive());
        userDTO.setProfilePhotoUrl(user.getProfilePhotoUrl());
        userDTO.setProfileCompletionPercentage(user.getProfileCompletionPercentage());

        AuthResponse response = new AuthResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setTokenType("Bearer");
        response.setExpiresIn(jwtUtil.getExpirationTime() / 1000);
        response.setUser(userDTO);
        return response;
    }
}
