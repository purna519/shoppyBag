package com.shoppyBag.Entity;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "products")
public class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_name", nullable = false)
    private String name;

    @Column(name = "product_description", nullable = false)
    private String description;
    
    @Column(name = "product_brand", nullable = false)
    private String brand;
    
    @Column(name = "product_price", nullable = false)
    private double price;
    
    @Column(name = "product_stock_quantity", nullable = false)
    private int stockQuantity;
    
    @Column(name = "product_category", nullable = false)
    private String category;
    
    @Column(name = "product_created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ProductImage> productImage;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<ProductVariant> productVariants;
    
}
