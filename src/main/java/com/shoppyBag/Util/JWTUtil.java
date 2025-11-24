package com.shoppyBag.Util;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import org.springframework.stereotype.Component;

import com.shoppyBag.Entity.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {

    // IMPORTANT: Load this from an environment variable or secure vault in a real application.
    private final String secretKey = "ShoppyBagSECRETKEYForJWTShoppyBagSECRETKEYForJWT_A_Very_Long_Secure_String";
    
    private final Key key = Keys.hmacShaKeyFor(secretKey.getBytes());
    
    // 1 hour validity for the Access Token
    private final long expTime = 3600_000;

    /**
     * Generates a new Access Token for a user.
     */
    public String generateToken(Users user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("role", user.getRole())
                .claim("userId", user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expTime))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validates a JWT by checking its signature and expiration time.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            System.err.println("JWT Validation Error: " + ex.getMessage());
            return false;
        }
    }

    private Claims extractAllClaims(String token) {
         return Jwts.parserBuilder()
                 .setSigningKey(key)
                 .build()
                 .parseClaimsJws(token)
                 .getBody();
    }
    
    /**
     * Extracts a specific claim from the token.
     */
    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extracts the user's email (Subject) from the token.
     */
    public String extractEmail(String token) {
        return getClaim(token, Claims::getSubject);
    }
    
    /**
     * Extracts the user's role from the token's custom claim.
     */
    public String extractRole(String token) {
        return getClaim(token, claims -> claims.get("role", String.class));
    }
    
    /**
     * Checks if the token has expired.
     */
     public boolean isTokenExpired(String token) {
         try {
             return extractAllClaims(token).getExpiration().before(new Date());
         } catch (Exception e) {
             return true; 
         }
     }
}