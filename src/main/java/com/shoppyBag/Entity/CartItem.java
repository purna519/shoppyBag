package com.shoppyBag.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "CartItem")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = true)
    private ProductVariant variant;

    private int quantity;
    private Double price;

    public CartItem(Cart cart, Product product, ProductVariant variant, int quantity, Double price) {
        this.cart = cart;
        this.product = product;
        this.variant = variant;
        this.quantity = quantity;
        this.price = price;
    }

}
