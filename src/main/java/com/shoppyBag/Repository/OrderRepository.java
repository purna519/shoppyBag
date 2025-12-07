package com.shoppyBag.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.shoppyBag.Entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUsersId(Long userId);
    
    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN true ELSE false END FROM Order o " +
           "JOIN o.orderItems oi " +
           "WHERE o.users.id = :userId " +
           "AND oi.productVariant.product.id = :productId " +
           "AND o.deliveryStatus = 'DELIVERED'")
    boolean hasUserPurchasedProduct(@Param("userId") Long userId, @Param("productId") Long productId);
}
