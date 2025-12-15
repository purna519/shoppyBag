package com.shoppyBag.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoppyBag.DTO.ReviewRequest;
import com.shoppyBag.DTO.ReviewResponse;
import com.shoppyBag.Service.ProductReviewService;
import com.shoppyBag.Util.JWTUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
public class ProductReviewController {

    @Autowired
    private ProductReviewService reviewService;
    
    @Autowired
    private JWTUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> submitReview(@Valid @RequestBody ReviewRequest request, @org.springframework.web.bind.annotation.RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Bearer header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please login to write a review"));
            }
            
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token. Please login again"));
            }
            
            ReviewResponse response = reviewService.submitReview(request, userEmail);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable Long productId) {
        List<ReviewResponse> reviews = reviewService.getApprovedReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/product/{productId}/stats")
    public ResponseEntity<Map<String, Object>> getProductRatingStats(@PathVariable Long productId) {
        Map<String, Object> stats = reviewService.getProductRatingStats(productId);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReviewResponse>> getUserReviews(@PathVariable Long userId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByUser(userId);
        return ResponseEntity.ok(reviews);
    }

    // Admin endpoints
    @GetMapping("/pending")
    public ResponseEntity<List<ReviewResponse>> getPendingReviews() {
        List<ReviewResponse> reviews = reviewService.getPendingReviews();
        return ResponseEntity.ok(reviews);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<ReviewResponse> approveReview(@PathVariable Long id) {
        try {
            ReviewResponse response = reviewService.approveReview(id);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, @org.springframework.web.bind.annotation.RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Extract token from Bearer header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Please login to delete a review"));
            }
            
            String token = authHeader.substring(7);
            String userEmail = jwtUtil.extractEmail(token);
            
            if (userEmail == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid token. Please login again"));
            }
            
            reviewService.deleteReview(id, userEmail);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin: Get all reviews
    @GetMapping("/all")
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }
}
