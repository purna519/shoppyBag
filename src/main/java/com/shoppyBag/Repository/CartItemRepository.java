package com.shoppyBag.Repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Entity.CartItem;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductVariant;


public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    CartItem findByCartAndProductAndVariant(Cart cart,Product product,ProductVariant variant);
}
