package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.OrderDTO;
import com.shoppyBag.Service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/place")
    public ApiResponse<OrderDTO> placeOrder(@RequestHeader("Authorization") String token) {
        return orderService.placeOrder(token);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/history")
    public ApiResponse<?> getOrderHistory(@RequestHeader("Authorization") String token) {
        return orderService.getOrders(token);
    }

    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @GetMapping("/{orderId}")
    public ApiResponse<?> getOrderById(@PathVariable Long orderId, @RequestHeader("Authorization") String token) {
        return orderService.getOrderById(orderId, token);
    }
}
