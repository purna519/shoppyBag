package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.shoppyBag.Service.UsersService;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.DTO.LoginRequestDTO;
import com.shoppyBag.DTO.ApiResponse;

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

    @PostMapping("/all")
    public ApiResponse<?> getAll(@RequestBody LoginRequestDTO dto) {
        return usersService.getAllUsers(dto);
    }

    @PostMapping("/delete")
    public ApiResponse<?> delete(@RequestBody LoginRequestDTO dto) {
        return usersService.deleteUser(dto);
    }
}
