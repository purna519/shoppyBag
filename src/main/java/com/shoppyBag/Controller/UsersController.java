package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/all")
    public ApiResponse<?> getAllUsers(@RequestHeader("Authorization") String token) {
        return usersService.getAllUsers(token);
    }

    @DeleteMapping("/delete")
    public ApiResponse<?> deleteUser(@RequestHeader("Authorization") String token) {
        return usersService.deleteUser(token);
    }

    @PutMapping("/update")
    public ApiResponse<?> updateUser(@RequestBody UpdateRequestDTO request, @RequestHeader("Authorization") String token) {
        return usersService.updateUser(request, token);
    }

    @GetMapping("/profile")
    public ApiResponse<?> getProfile(@RequestHeader("Authorization") String token) {
        return usersService.getProfile(token);
    }
}
