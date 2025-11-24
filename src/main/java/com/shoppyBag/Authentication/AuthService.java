package com.shoppyBag.Authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.LoginRequestDTO;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Util.JWTUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JWTUtil jwtUtil;

    public ApiResponse<String> loginTokenGeneration(LoginRequestDTO dto) {
        Users u = userRepository.findByEmail(dto.getEmail());
        if (u == null) {
            return new ApiResponse<>("error", "User not found", null);
        }
        if (!passwordEncoder.matches(dto.getPassword(), u.getPasswordHash())) {
            return new ApiResponse<>("error", "Invalid credentials", null);
        }
        String token = jwtUtil.generateToken(u);
        return new ApiResponse<>("success", "Login successful", token);
    }

    public ApiResponse<?> validateToken(String token) {
        if(jwtUtil.validateToken(token)) {
            return new ApiResponse<String>("Success", "Token is valid", null);
        }
        else {
            return new ApiResponse<String>("Error", "Token is Invalid", null);
        }
    }

    
}
