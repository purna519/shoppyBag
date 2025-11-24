package com.shoppyBag.DTO;

import java.util.*;

import lombok.Data;

@Data
public class CartDTO {
    private Long id;
    private Double totalAmount;
    private Date createdAt;
    private List<CartItemDTO> items;
}
