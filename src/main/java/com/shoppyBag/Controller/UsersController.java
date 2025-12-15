package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.shoppyBag.Service.UsersService;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.DTO.*;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UsersService usersService;

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody Users user) {
        return usersService.registerUser(user);
    }

    @PostMapping("/signin")
    public ApiResponse<?> signin(@RequestBody LoginRequestDTO dto) {
        return usersService.login(dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ApiResponse<?> getAllUsers(@RequestHeader("Authorization") String token) {
        return usersService.getAllUsers(token);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete")
    public ApiResponse<?> deleteUser(@RequestBody DeleteUserRequestDTO request, @RequestHeader("Authorization") String token) {
        return usersService.deleteUser(request, token);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PutMapping("/update")
    public ApiResponse<?> updateUser(@RequestBody UpdateRequestDTO request, @RequestHeader("Authorization") String token) {
        return usersService.updateUser(request, token);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/profile")
    public ApiResponse<?> getProfile(@RequestHeader("Authorization") String token) {
        return usersService.getProfile(token);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/change-password")
    public ApiResponse<?> changePassword(@RequestBody com.shoppyBag.DTO.ChangePasswordDTO request, @RequestHeader("Authorization") String token) {
        return usersService.changePassword(request, token);
    }
}
