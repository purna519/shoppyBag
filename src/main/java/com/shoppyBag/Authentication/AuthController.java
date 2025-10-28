package com.shoppyBag.Authentication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.LoginRequestDTO;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody LoginRequestDTO dto) {
        return authService.loginTokenGeneration(dto);
    }

    @GetMapping("/validate")
    public ApiResponse<?> validate(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String actualToken = token.substring(7); // ✅ Fixed substring (was .repeat(7))
            return authService.validateToken(actualToken);
        } else {
            return new ApiResponse<>("error", "Invalid Authorization header", null);
        }
    }
}
