package com.shoppyBag.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Order;
import com.shoppyBag.Service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    //Place Order (from cart)
    @PostMapping("/place")
    public ApiResponse<Order> placeOrder(@RequestHeader("Authorization") String token) {
        return orderService.placeOrder(token);
    }

    //Get Order History
    @GetMapping("/history")
    public ApiResponse<?> getOrderHistory(@RequestHeader("Authorization") String token) {
        return orderService.getOrders(token);
    }

    //Get Specific Order by ID
    @GetMapping("/{orderId}")
    public ApiResponse<?> getOrderById(@PathVariable Long orderId, @RequestHeader("Authorization") String token) {
        return orderService.getOrderById(orderId, token);
    }
}
