package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class ProductVariantDTO {
    private Long id;
    private String color;
    private String size;
    private String sku;
    private double price;
    private int stockQuantity;
}

