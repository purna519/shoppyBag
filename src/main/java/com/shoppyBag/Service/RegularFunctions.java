package com.shoppyBag.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Util.JWTUtil;

@Component
public class RegularFunctions {

    @Autowired
    private JWTUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    public Users validateAdminToken(String token) {
        if (token == null || !token.startsWith("Bearer "))
            return null;
        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);
        Users user = userRepository.findByEmail(email);
        if (user == null || !"ADMIN".equalsIgnoreCase(user.getRole()))
            return null;
        return user;
    }
    
    public Users validateToken(String token) {
        if (token == null || !token.startsWith("Bearer ")) return null;
        String actualToken = token.substring(7);
        String email = jwtUtil.extractEmail(actualToken);
        Users user = userRepository.findByEmail(email);
        return user;
    }
}
