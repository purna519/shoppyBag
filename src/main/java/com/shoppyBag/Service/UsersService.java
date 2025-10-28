package com.shoppyBag.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.LoginRequestDTO;
import com.shoppyBag.DTO.UpdateRequestDTO;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
public class UsersService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public UsersService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // New user registration
    public ApiResponse<Users> registerUser(Users user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return new ApiResponse<>("error", "Email already registered", null);
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        Users saved = userRepository.save(user);
        return new ApiResponse<>("success", "Registration successful", saved);
    }

    // Login User
    public ApiResponse<String> login(LoginRequestDTO dto) {
        Users u = userRepository.findByEmail(dto.getEmail());
        if (u == null)
            return new ApiResponse<>("error", "User not found", null);
        boolean matches = passwordEncoder.matches(dto.getPassword(), u.getPasswordHash());
        if (!matches)
            return new ApiResponse<>("error", "Invalid credentials", null);
        return new ApiResponse<>("success", "Login successful", "ok");
    }
    
    // Users list only for admin
    public ApiResponse<List<Users>> getAllUsers(LoginRequestDTO dto) {
        Users u = userRepository.findByEmail(dto.getEmail());
        if (u == null)
            return new ApiResponse<>("error", "Unauthorized", null);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(u.getRole()) || "admin@app.com".equalsIgnoreCase(u.getEmail());
        if (!isAdmin || !passwordEncoder.matches(dto.getPassword(), u.getPasswordHash())) {
            return new ApiResponse<>("error", "Forbidden", null);
        }
        List<Users> all = userRepository.findAll();
        return new ApiResponse<>("success", "Users fetched", all);
    }
    
    // Delete user
    public ApiResponse<String> deleteUser(LoginRequestDTO dto) {
        Users u = userRepository.findByEmail(dto.getEmail());
        if (u == null)
            return new ApiResponse<>("error", "User not found", null);
        if (!passwordEncoder.matches(dto.getPassword(), u.getPasswordHash())) {
            return new ApiResponse<>("error", "Invalid credentials", null);
        }
        userRepository.deleteById(u.getId());
        return new ApiResponse<>("success", "User deleted", "ok");
    }
    
    // Update user
    public ApiResponse<Users> updateUser(UpdateRequestDTO dto) {
        Users u = userRepository.findByEmail(dto.getEmail());
        if (u == null) {
            return new ApiResponse<>("error", "User not found", null);
        } else {
            if (dto.getFullname() != null) {
                u.setFullname(dto.getFullname());
            }
            if (dto.getPasswordHash() != null) {
                u.setPasswordHash(passwordEncoder.encode(dto.getPasswordHash()));
            }
            if (dto.getRole() != null) {
                u.setRole(dto.getRole());
            }
            return new ApiResponse<Users>("Success", "User account updated Succesfully", u);
        }
    }

}
