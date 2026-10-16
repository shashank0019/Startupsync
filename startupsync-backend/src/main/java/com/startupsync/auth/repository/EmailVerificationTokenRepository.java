package com.startupsync.auth.repository;

import com.startupsync.auth.entity.EmailVerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, String> {

    Optional<EmailVerificationToken> findByEmail(String email);

    Optional<EmailVerificationToken> findByVerificationCode(String verificationCode);

    void deleteByEmailAndIsVerifiedTrue(String email);

    void deleteByExpiresAtBefore(LocalDateTime dateTime);
}
