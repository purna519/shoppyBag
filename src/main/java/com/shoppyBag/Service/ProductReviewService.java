package com.shoppyBag.Service;

import java.util.List;
import java.util.Map;

import com.shoppyBag.DTO.ReviewRequest;
import com.shoppyBag.DTO.ReviewResponse;

public interface ProductReviewService {
    
    // Submit a new review
    ReviewResponse submitReview(ReviewRequest request, String userEmail);
    
    // Get all approved reviews for a product
    List<ReviewResponse> getApprovedReviewsByProduct(Long productId);
    
    // Get average rating and count for a product
    Map<String, Object> getProductRatingStats(Long productId);
    
    // Admin: Get all pending reviews
    List<ReviewResponse> getPendingReviews();
    
    // Admin: Approve a review
    ReviewResponse approveReview(Long reviewId);
    
    // Delete a review (user can delete own reviews, admin can delete any)
    void deleteReview(Long reviewId, String userEmail);
    
    // Get reviews by user
    List<ReviewResponse> getReviewsByUser(Long userId);
    
    // Admin: Get all reviews (both approved and pending)
    List<ReviewResponse> getAllReviews();
}
