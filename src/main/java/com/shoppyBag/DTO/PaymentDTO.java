package com.shoppyBag.DTO;

import lombok.Data;

@Data
public class PaymentDTO {
    private Long id;
    private String paymentMethod;
    private double amountPaid;
    private String paymentStatus;
}