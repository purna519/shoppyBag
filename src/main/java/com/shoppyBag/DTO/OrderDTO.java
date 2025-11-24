package com.shoppyBag.DTO;
import java.util.List;

import lombok.Data;

@Data
public class OrderDTO {

    private Long id;
    private double totalAmount;
    private String status;
    private Long userId; 
    
    private List<OrderItemDTO> orderItems;
    
    private PaymentDTO payment;
}