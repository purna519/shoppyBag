package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long id;
    private String productName;
    private ProductVariantDTO variant;
    private int quantity;
    private Double price;
}
