package com.shoppyBag.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "Cart")
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private Users user;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @ToString.Exclude
    private List<CartItem> items = new ArrayList<>();

    private Double totalAmount;

    private Date createdAt = new Date();

    public Cart() {
    }

    public Cart(Users users) {
        this.user = users;
    }

}
