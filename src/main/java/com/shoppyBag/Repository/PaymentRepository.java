package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.shoppyBag.Entity.Order;
import com.shoppyBag.Entity.Payment;


public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Payment findByOrderId(Long orderId);

    Payment findByTransactionid(String transactionId);
    
    Payment findByOrder(Order order);
}
