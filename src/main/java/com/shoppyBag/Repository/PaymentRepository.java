package com.shoppyBag.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.shoppyBag.Entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
