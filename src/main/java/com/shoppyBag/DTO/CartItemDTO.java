package com.shoppyBag.DTO;

import com.shoppyBag.Entity.Product;

import lombok.Data;

@Data
public class CartItemDTO {
    private Long id;
    private String productName;
    private Product product;
    private ProductVariantDTO variant;
    private int quantity;
    private Double price;
}
