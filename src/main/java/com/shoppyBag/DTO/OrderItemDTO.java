package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class OrderItemDTO {

    private Long id;
    private int quantity;
    private double price;
    private ProductVariantDTO productVariant;
    
}