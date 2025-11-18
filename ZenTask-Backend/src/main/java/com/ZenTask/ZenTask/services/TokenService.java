package com.ZenTask.ZenTask.services;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.Optional;

@Service
public class TokenService {

    private final Key key = Keys.hmacShaKeyFor("THIS_IS_A_SUPER_LONG_JWT_SECRET_KEY_1234567890".getBytes());

    // Generate JWT token with subject (e.g., user email) and expiration
    public String generateToken(String email) {
        long expirationTime = 1000 * 60 * 60 * 24 * 10 ;
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(key)
                .compact();
    }

    // Safely parse the token and extract all claims
    private Optional<Claims> extractAllClaims(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return Optional.of(claims);
        } catch (JwtException | IllegalArgumentException e) {
            return Optional.empty();
        }
    }

    public Optional<String> extractUserIdentifier(String token) {
        return extractAllClaims(token).map(Claims::getSubject);
    }

    public boolean isTokenValid(String token) {
        return extractAllClaims(token).isPresent();
    }

}
