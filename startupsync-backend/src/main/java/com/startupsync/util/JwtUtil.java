package com.startupsync.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long jwtRefreshExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String userId, String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", email);
        claims.put("role", role);
        claims.put("type", "ACCESS");
        
        return createToken(claims, userId, jwtExpirationMs);
    }

    public String generateAccessTokenFromAuthentication(Authentication authentication) {
        String userId = authentication.getName();
        String email = (String) authentication.getDetails();
        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("MEMBER");
        
        return generateAccessToken(userId, email, role);
    }

    public String generateRefreshToken(String userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "REFRESH");
        
        return createToken(claims, userId, jwtRefreshExpirationMs);
    }

    private String createToken(Map<String, Object> claims, String subject, long expirationTime) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(now)
                .expiration(expirationDate)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    public String extractUserId(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractEmail(String token) {
        return (String) extractAllClaims(token).get("email");
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public String extractTokenType(String token) {
        return (String) extractAllClaims(token).get("type");
    }

    public boolean isTokenValid(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (SecurityException e) {
            log.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }

    public boolean isTokenExpired(String token) {
        try {
            extractAllClaims(token);
            return false;
        } catch (ExpiredJwtException e) {
            return true;
        }
    }

    public long getExpirationTime() {
        return jwtExpirationMs;
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
