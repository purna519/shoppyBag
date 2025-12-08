package com.shoppyBag.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.DTO.OrderDTO;
import com.shoppyBag.DTO.OrderItemDTO;
import com.shoppyBag.DTO.PaymentDTO;
import com.shoppyBag.DTO.ProductVariantDTO;
import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Entity.CartItem;
import com.shoppyBag.Entity.Order;
import com.shoppyBag.Entity.OrderItem;
import com.shoppyBag.Entity.Payment;
import com.shoppyBag.Entity.ProductVariant;
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

        private ProductVariantDTO convertToProductVariantDTO(ProductVariant variant) {
        if (variant == null) return null;
        
        ProductVariantDTO dto = new ProductVariantDTO();
        dto.setId(variant.getId());
        dto.setColor(variant.getColor());
        dto.setSize(variant.getSize());
        dto.setSku(variant.getSku());
        dto.setPrice(variant.getPrice());
        dto.setStockQuantity(variant.getStockQuantity());
        
        // Include product information for reviews
        if (variant.getProduct() != null) {
            dto.setProductId(variant.getProduct().getId());
            dto.setProductName(variant.getProduct().getName());
        }
        
        return dto;
    }


    private OrderItemDTO convertToOrderItemDTO(OrderItem orderItem) {
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(orderItem.getId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setProductVariant(convertToProductVariantDTO(orderItem.getProductVariant()));
        return dto;
    }

    private PaymentDTO convertToPaymentDTO(Payment payment) {
        if (payment == null) return null;
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setAmountPaid(payment.getAmount()); 
        dto.setPaymentStatus(payment.getPaymentStatus()); 
        return dto;
    }

    public OrderDTO convertToOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setDeliveryStatus(order.getDeliveryStatus());
        dto.setUserId(order.getUsers().getId());
        dto.setOrderDate(order.getOrderdate());

        if (order.getOrderItems() != null) {
            List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                    .map(this::convertToOrderItemDTO)
                    .toList();
            dto.setOrderItems(itemDTOs);
        }

        dto.setPayment(convertToPaymentDTO(order.getPayment()));

        return dto;
    }
    


    public ApiResponse<OrderDTO> placeOrder(String token) {
        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<>("Error", "Invalid User", null);
        }

        Cart cart = cartRepository.findByUser(users);
        if (cart.getItems().isEmpty()) {
            return new ApiResponse<>("Error", "Cart Items are Empty", null);
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

        return new ApiResponse<>("Success", "OrderItems Succesfully added", convertToOrderDTO(order));

    }

    public ApiResponse<List<OrderDTO>> getOrders(String token) {
        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<List<OrderDTO>>("Error", "Invalid User", null);
        }

        List<Order> orders;
        
        // If admin, return all orders. Otherwise, return only user's orders
        if ("ADMIN".equalsIgnoreCase(users.getRole())) {
            orders = orderRepository.findAll();
        } else {
            orders = orderRepository.findByUsersId(users.getId());
        }

        if (orders.isEmpty()) {
            return new ApiResponse<List<OrderDTO>>("Error", "No past Orders", null);
        }

        List<OrderDTO> orderDTOs = orders.stream()
            .map(this::convertToOrderDTO)
            .toList();

        return new ApiResponse<List<OrderDTO>>("Success", "Orders fetched successfully", orderDTOs);
    }

    public ApiResponse<OrderDTO> getOrderById(Long id, String token) {
        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<>("Error", "Invalid User", null);
        }

        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));

        // Allow admin to view all orders, or users to view only their own orders
        if (!users.getRole().equals("ADMIN") && !order.getUsers().getId().equals(users.getId())) {
            return new ApiResponse<>("Error", "Access denied for this order", null);
        }

        return new ApiResponse<>("Success", "Order succesfully fetched", convertToOrderDTO(order));

    }
    
    public ApiResponse<?> updateDeliveryStatus(Long orderId, String deliveryStatus, String token) {
        Users admin = regularFunctions.validateAdminToken(token);
        if (admin == null) {
            return new ApiResponse<>("Error", "Admin access required", null);
        }
        
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        order.setDeliveryStatus(deliveryStatus);
        orderRepository.save(order);
        
        return new ApiResponse<>("Success", "Delivery status updated successfully", convertToOrderDTO(order));
    }

}
