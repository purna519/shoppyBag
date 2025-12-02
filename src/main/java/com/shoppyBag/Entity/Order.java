package com.shoppyBag.Entity;

import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.ToString;

@Data
@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_date",nullable=false)
    private LocalDateTime orderdate = LocalDateTime.now();

    @Column(name="total_amount",nullable=false)
    private double totalAmount;

    @Column(name="status",nullable=false)
    private String status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="users_id",nullable=false)
    @JsonIgnore
    @ToString.Exclude
    private Users users;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<OrderItem> orderItems;

    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL)
    @ToString.Exclude
    private Payment payment;

    public Order(LocalDateTime orderDate, double totalAmount, String status, Users users) {
        this.totalAmount = totalAmount;
        this.orderdate = orderDate;
        this.status = status;
        this.users = users;
    }

    public Order() {
    }
    
}
