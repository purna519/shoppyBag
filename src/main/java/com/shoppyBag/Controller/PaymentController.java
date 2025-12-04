package com.shoppyBag.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Service.PaymentService;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowCredentials = "true")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // INITIATE PAYMENT
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    @PostMapping("/initiate/{orderId}")
    public ResponseEntity<?> initiatePayment(
            @RequestHeader("Authorization") String token,
            @PathVariable Long orderId,
            @RequestParam String method) {

        ApiResponse<Map<String, String>> res = paymentService.intiatePayment(token, orderId, method);
        return ResponseEntity.ok(res);
    }

    // VERIFY SIGNATURE FROM FRONTEND
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, Object> payload) {
        ApiResponse<String> res = paymentService.verifyPaymentSignature(payload);
        return ResponseEntity.ok(res);
    }

    // RAZORPAY WEBHOOK
    @PostMapping("/webhook")
    public ResponseEntity<?> razorpayWebhook(@RequestHeader("X-Razorpay-Signature") String signature, @RequestBody String webhookBody) {
        ApiResponse<String> res = paymentService.handleWebhook(signature, webhookBody);
        return ResponseEntity.ok(res);
    }
}
