package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppyBag.Entity.Cart;
import com.shoppyBag.Entity.Users;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUser(Users user);
}
