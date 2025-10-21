package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppyBag.Entity.CartItem;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
