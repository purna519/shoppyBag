package com.shoppyBag.Util;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.shoppyBag.Entity.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {
    private final String secretKey = "ShoppyBagSECRETKEYForJWTShoppyBagSECRETKEYForJWT";
    private final Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
    private final long expTime = 3600_000;

    public String generateToken(Users user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate token
    public boolean validateToken(String token) {
        String extractedEmail = extractEmail(token);
        return ((extractedEmail != null) && !isTokenExpired(token));
    }

    // Extract email from token
    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }


    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }

}
