package com.shoppyBag.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "CartItem")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference
    @ToString.Exclude
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne
    @JoinColumn(name = "variant_id", nullable = true)
    private ProductVariant variant;

    private int quantity;
    private Double price;

    @ManyToOne
    @JoinColumn(name = "users_id", nullable = false)
    @JsonIgnore
    @ToString.Exclude
    private Users users;

    public CartItem() {
    }

    public CartItem(Cart cart, Product product, ProductVariant variant, int quantity, Double price, Users users) {
        this.cart = cart;
        this.product = product;
        this.variant = variant;
        this.quantity = quantity;
        this.price = price;
        this.users = users;
    }

}
