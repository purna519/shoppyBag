package com.shoppyBag.Service;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shoppyBag.DTO.ApiResponse;
import com.shoppyBag.Entity.Order;
import com.shoppyBag.Entity.Payment;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.OrderRepository;
import com.shoppyBag.Repository.PaymentRepository;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class PaymentService {

    @Value("${razorpay.key}")
    private String razorpayKey;

    @Value("${razorpay.secret}")
    private String razorpaySecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private RegularFunctions regularFunctions;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private PaymentRepository paymentRepository;




    // ⭐ 1. INITIATE PAYMENT
    public ApiResponse<Map<String, String>> intiatePayment(String token, Long orderId, String method) {

        Users users = regularFunctions.validateToken(token);
        if (users == null) {
            return new ApiResponse<>("Error", "Invalid User", null);
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order Not Found"));

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentStatus("PENDING");
        payment.setAmount(order.getTotalAmount());
        paymentRepository.save(payment);

        if (method.equalsIgnoreCase("razorpay") || method.equalsIgnoreCase("UPI")) {

            payment.setPaymentMethod("RAZORPAY");

            try {
                long amountInPaise = Math.round(order.getTotalAmount() * 100);

                Map<String, Object> payload = new HashMap<>();
                payload.put("amount", amountInPaise);
                payload.put("currency", "INR");
                payload.put("receipt", "order_rcpt_" + order.getId());
                payload.put("payment_capture", 1);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                String auth = razorpayKey + ":" + razorpaySecret;
                String encoded = java.util.Base64.getEncoder()
                        .encodeToString(auth.getBytes(StandardCharsets.UTF_8));
                headers.set("Authorization", "Basic " + encoded);

                HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

                ResponseEntity<String> razorpayResponse = restTemplate.postForEntity(
                        "https://api.razorpay.com/v1/orders",
                        request,
                        String.class);

                if (!razorpayResponse.getStatusCode().is2xxSuccessful()) {
                    return new ApiResponse<>("error", "Razorpay order creation failed", null);
                }

                JsonNode root = objectMapper.readTree(razorpayResponse.getBody());
                String razorpayOrderId = root.path("id").asText();

                payment.setTransactionid(razorpayOrderId);
                paymentRepository.save(payment);

                Map<String, String> response = new HashMap<>();
                response.put("razorpayOrderId", razorpayOrderId);
                response.put("razorpayKey", razorpayKey);
                response.put("currency", "INR");
                response.put("amount", String.valueOf(amountInPaise));

                return new ApiResponse<>("success", "Razorpay order created", response);

            } catch (Exception e) {
                return new ApiResponse<>("error", "Razorpay error: " + e.getMessage(), null);
            }
        }

        else if (method.equalsIgnoreCase("COD")) {

            payment.setPaymentMethod("COD");
            payment.setPaymentStatus("PENDING_COD");

            String txn = "COD" + order.getId() + "-" + System.currentTimeMillis();
            payment.setTransactionid(txn);
            paymentRepository.save(payment);

            order.setStatus("CONFIRMED_COD");
            orderRepository.save(order);

            Map<String, String> response = new HashMap<>();
            response.put("Message", "COD-CONFIRMED");
            response.put("Transaction ID", txn);

            return new ApiResponse<>("Success", "Order Confirmed on COD", response);
        }

        return new ApiResponse<>("Error", "Invalid Payment Method", null);
    }




    // ⭐ 2. VERIFY PAYMENT SIGNATURE — FRONTEND CALLS THIS
    public ApiResponse<String> verifyPaymentSignature(Map<String, Object> payload) {

        String orderId = (String) payload.get("razorpay_order_id");
        String paymentId = (String) payload.get("razorpay_payment_id");
        String signature = (String) payload.get("razorpay_signature");

        String data = orderId + "|" + paymentId;

        try {
            javax.crypto.Mac mac = javax.crypto.Mac.getInstance("HmacSHA256");
            javax.crypto.spec.SecretKeySpec secretKey =
                    new javax.crypto.spec.SecretKeySpec(razorpaySecret.getBytes(), "HmacSHA256");

            mac.init(secretKey);
            byte[] raw = mac.doFinal(data.getBytes());

            StringBuilder sb = new StringBuilder();
            for (byte b : raw) sb.append(String.format("%02x", b));

            String computed = sb.toString();

            if (computed.equals(signature)) {
                return new ApiResponse<>("Success", "Signature Verified", "VALID");
            } else {
                return new ApiResponse<>("Error", "Signature Mismatch", "INVALID");
            }

        } catch (Exception e) {
            return new ApiResponse<>("Error", "Verification Failed: " + e.getMessage(), null);
        }
    }




    // ⭐ 3. HANDLE RAZORPAY WEBHOOK
    public ApiResponse<String> handleWebhook(String signature, String body) {

        try {
            JsonNode json = objectMapper.readTree(body);

            String event = json.path("event").asText();
            String orderId = json.path("payload").path("payment").path("entity").path("order_id").asText();

            Payment payment = paymentRepository.findByTransactionid(orderId);
            if (payment == null) {
                return new ApiResponse<>("Error", "Payment Not Found", null);
            }

            if (event.equals("payment.captured")) {
                payment.setPaymentStatus("SUCCESS");
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setStatus("PAID");
                orderRepository.save(order);

                return new ApiResponse<>("Success", "Payment Captured", null);
            }

            if (event.equals("payment.failed")) {
                payment.setPaymentStatus("FAILED");
                paymentRepository.save(payment);

                Order order = payment.getOrder();
                order.setStatus("PAYMENT_FAILED");
                orderRepository.save(order);

                return new ApiResponse<>("Error", "Payment Failed", null);
            }

            return new ApiResponse<>("Success", "Webhook Received", null);

        } catch (Exception e) {
            return new ApiResponse<>("Error", "Webhook error: " + e.getMessage(), null);
        }
    }
}
