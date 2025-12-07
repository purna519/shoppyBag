package com.shoppyBag.Util;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.shoppyBag.Entity.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JWTUtil {

    @Value("${JWT_SECRET}")
    private String secretKey;
    
    private Key key;
    
    @Value("${JWT_EXPIRATION}")
    private long expTime;

    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(secretKey.getBytes());
    }

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
    
    public <T> T getClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

  
    public String extractEmail(String token) {
        return getClaim(token, Claims::getSubject);
    }
    
   
    public String extractRole(String token) {
        return getClaim(token, claims -> claims.get("role", String.class));
    }
    

     public boolean isTokenExpired(String token) {
         try {
             return extractAllClaims(token).getExpiration().before(new Date());
         } catch (Exception e) {
             return true; 
         }
     }
}