package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Service.FileStorageService;

@RestController
@RequestMapping("/api/profile-image")
public class ProfileImageController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @PostMapping("/upload")
    public ApiResponse<?> uploadProfileImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("email") String email,
            @AuthenticationPrincipal Users currentUser) {
        
        try {
            if (currentUser == null) {
                return ApiResponse.error("User not authenticated");
            }
            
            boolean isAdmin = "ADMIN".equals(currentUser.getRole());
            
            if (!isAdmin && !currentUser.getEmail().equals(email)) {
                return ApiResponse.error("You can only update your own profile image");
            }
            
            Users targetUser = userRepository.findByEmail(email);
            if (targetUser == null) {
                return ApiResponse.error("User not found with email: " + email);
            }

            String customName = email.replace("@", "_at_").replace(".", "_") + "_profile";

            if (targetUser.getProfileImageUrl() != null && !targetUser.getProfileImageUrl().isEmpty()) {
                fileStorageService.deleteFile(targetUser.getProfileImageUrl(), "profiles");
            }

            String fileName = fileStorageService.storeFile(file, "profiles", customName);

            targetUser.setProfileImageUrl(fileName);
            userRepository.save(targetUser);

            return ApiResponse.success("Profile image uploaded successfully", fileName);
        } catch (Exception e) {
            return ApiResponse.error("Failed to upload profile image: " + e.getMessage());
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<Resource> getProfileImage(@PathVariable String email) {
        try {
            Users user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            if (user.getProfileImageUrl() == null || user.getProfileImageUrl().isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = fileStorageService.loadFileAsResource(user.getProfileImageUrl(), "profiles");

            String contentType = "image/jpeg";
            if (user.getProfileImageUrl().endsWith(".png")) {
                contentType = "image/png";
            } else if (user.getProfileImageUrl().endsWith(".webp")) {
                contentType = "image/webp";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{email}")
    public ApiResponse<?> deleteProfileImage(
            @PathVariable String email,
            @RequestHeader("Authorization") String token) {
        
        try {
            Users user = userRepository.findByEmail(email);
            if (user == null) {
                return ApiResponse.error("User not found");
            }

            if (user.getProfileImageUrl() == null || user.getProfileImageUrl().isEmpty()) {
                return ApiResponse.error("No profile image to delete");
            }

            boolean deleted = fileStorageService.deleteFile(user.getProfileImageUrl(), "profiles");

            if (deleted) {
                user.setProfileImageUrl(null);
                userRepository.save(user);
                return ApiResponse.success("Profile image deleted successfully", null);
            } else {
                return ApiResponse.error("Failed to delete profile image");
            }
        } catch (Exception e) {
            return ApiResponse.error("Error deleting profile image: " + e.getMessage());
        }
    }
}
