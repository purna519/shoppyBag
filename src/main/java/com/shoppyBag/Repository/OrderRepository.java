package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppyBag.Entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
