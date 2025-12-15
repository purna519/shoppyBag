package com.shoppyBag.Service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.shoppyBag.DTO.*;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Model.CustomUserDetails;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Util.JWTUtil;

@Service
public class UsersService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JWTUtil jwtUtil;
    private final AuthenticationManager authManager;

    @Autowired
    private RegularFunctions regularFunctions;

    @Autowired
    public UsersService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, JWTUtil jwtUtil, AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authManager = authManager;
    }

    // Register user
    public ApiResponse<Users> registerUser(Users user) {
        if (userRepository.findByEmail(user.getEmail()) != null)
            return new ApiResponse<>("error", "Email already registered", null);

        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        user.setRole("USER");
        Users saved = userRepository.save(user);
        return new ApiResponse<>("success", "Registration successful", saved);
    }

    // Login user and return token
    public ApiResponse<String> login(LoginRequestDTO dto) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getPassword()));
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
        String u = userDetails.getUsername();
        if (u == null)
            return new ApiResponse<>("error", "User not found", null);
        
        Users user = userRepository.findByEmail(u);

        String token = jwtUtil.generateToken(user);
        return new ApiResponse<>("success", "Login successful", token);
    }

    // Get all users (admin only)
    public ApiResponse<List<Users>> getAllUsers(String token) {
        Users user = regularFunctions.validateToken(token);
        if (user == null) {
            return new ApiResponse<>("error", "Invalid or missing token", null);
        }

        return new ApiResponse<>("success", "Users fetched successfully", userRepository.findAll());
    }

    // Update user (self or admin)
    public ApiResponse<Users> updateUser(UpdateRequestDTO dto, String token) {
        Users loggedUser = regularFunctions.validateToken(token);
        if (loggedUser == null)
            return new ApiResponse<>("error", "Invalid or missing token", null);

        Users targetUser = userRepository.findByEmail(dto.getEmail());
        if (targetUser == null)
            return new ApiResponse<>("error", "User not found", null);

        boolean isSelf = loggedUser.getEmail().equalsIgnoreCase(dto.getEmail());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(loggedUser.getRole());

        if (!isSelf && !isAdmin)
            return new ApiResponse<>("error", "Permission denied", null);

        if (dto.getFullname() != null) targetUser.setFullname(dto.getFullname());
        if (dto.getPasswordHash() != null)
            targetUser.setPasswordHash(passwordEncoder.encode(dto.getPasswordHash()));
        if (dto.getRole() != null && isAdmin)
            targetUser.setRole(dto.getRole());

        Users updated = userRepository.save(targetUser);
        return new ApiResponse<>("success", "User updated successfully", updated);
    }

    // Delete user (admin only)
    public ApiResponse<String> deleteUser(DeleteUserRequestDTO request, String token) {
        Users admin = regularFunctions.validateToken(token);
        if (admin == null)
            return new ApiResponse<>("error", "Invalid or missing token", null);

        // Only admins can delete users
        if (!"ADMIN".equalsIgnoreCase(admin.getRole()))
            return new ApiResponse<>("error", "Permission denied - admin access required", null);

        // Find the target user to delete
        Users targetUser = userRepository.findByEmail(request.getEmail());
        if (targetUser == null)
            return new ApiResponse<>("error", "User not found", null);

        // Prevent admin from deleting themselves
        if (admin.getEmail().equalsIgnoreCase(targetUser.getEmail()))
            return new ApiResponse<>("error", "Cannot delete your own admin account", null);

        userRepository.delete(targetUser);
        return new ApiResponse<>("success", "User deleted successfully", null);
    }

    // Get current user profile
    public ApiResponse<Users> getProfile(String token) {
        Users user = regularFunctions.validateToken(token);
        if (user == null)
            return new ApiResponse<>("error", "Invalid or missing token", null);

        return new ApiResponse<>("success", "Profile fetched successfully", user);
    }

    // Change password
    public ApiResponse<String> changePassword(ChangePasswordDTO request, String token) {
        Users user = regularFunctions.validateToken(token);
        if (user == null)
            return new ApiResponse<>("error", "Invalid or missing token", null);

        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return new ApiResponse<>("error", "Current password is incorrect", null);
        }

        // Update to new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return new ApiResponse<>("success", "Password changed successfully", null);
    }
}
