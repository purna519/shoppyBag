package com.shoppyBag.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Entity.CartItem;
import com.shoppyBag.Entity.Order;
import com.shoppyBag.Entity.OrderItem;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.CartRepository;
import com.shoppyBag.Repository.OrderRepository;

@Service
public class OrderService {
    
    @Autowired
    private RegularFunctions regularFunctions;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private OrderRepository orderRepository;

    public ApiResponse<Order> placeOrder(String token) {
        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<Order>("Error", "Invalid User", null);
        }

        Cart cart = cartRepository.findByUser(users);
        if (cart.getItems().isEmpty()) {
            return new ApiResponse<Order>("Error", "Cart Items are Empty", null);
        }

        Order order = new Order(LocalDateTime.now(), 0, "Pending", users);

        List<OrderItem> orderItems = new ArrayList<>();
        double total_amount = 0;

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setPrice(cartItem.getPrice());
            orderItem.setProductVariant(cartItem.getVariant());
            orderItem.setQuantity(cartItem.getQuantity());

            orderItems.add(orderItem);

            total_amount += cartItem.getPrice() * cartItem.getQuantity();
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(total_amount);

        orderRepository.save(order);

        cartRepository.delete(cart);

        return new ApiResponse<Order>("Success", "OrderItems Succesfully added", order);

    }

    public ApiResponse<List<Order>> getOrders(String token) {
        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<List<Order>>("Error", "Invalid User", null);
        }

        List<Order> orders = orderRepository.findByUsersId(users.getId());

        if (orders.isEmpty()) {
            return new ApiResponse<List<Order>>("Error", "No past Orders", null);
        }

        return new ApiResponse<List<Order>>("Success", "Orders fetched successfully", orders);
    }

    public ApiResponse<Order> getOrderById(Long id, String token) {
        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<Order>("Error", "Invalid User", null);
        }

        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUsers().getId().equals(users.getId())) {
            return new ApiResponse<>("Error", "Access denied for this order", null);
        }

        return new ApiResponse<Order>("Success", "Order succesfully fetched", order);

    }

}
