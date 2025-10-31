package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class ProductUpdateReqDTO {

    private String name;
    
    private String description;
    
    private String brand;

    private double price;

    private int stockQuantity;
    
    private String category;   
}
