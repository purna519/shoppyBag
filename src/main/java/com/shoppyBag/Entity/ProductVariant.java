package com.shoppyBag.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "product_variant")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_variant_color", nullable = false)
    private String color;
    
    @Column(name = "product_variant_size", nullable = false)
    private String size;
    
    @Column(name = "product_variant_sku", nullable = false)
    private String sku;
    
    @Column(name = "product_variant_price", nullable = false)
    private double price;

    @Column(name = "product_variant_stock_quantity", nullable = false)
    private int stockQuantity;

    @Column(name = "product_variant_created_at", nullable = false)
    private LocalDateTime createAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

}
