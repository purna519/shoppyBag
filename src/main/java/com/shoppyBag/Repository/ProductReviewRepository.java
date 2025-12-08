package com.shoppyBag.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.shoppyBag.Entity.ProductReview;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {
    
    // Find all approved reviews for a specific product
    List<ProductReview> findByProductIdAndIsApprovedTrue(Long productId);
    
    // Find all reviews by a specific user
    List<ProductReview> findByUserId(Long userId);
    
    // Count approved reviews for a product
    Long countByProductIdAndIsApprovedTrue(Long productId);
    
    // Count approved reviews with comments (text reviews only)
    @Query("SELECT COUNT(r) FROM ProductReview r WHERE r.product.id = :productId AND r.isApproved = true AND r.comment IS NOT NULL AND r.comment != ''")
    Long countReviewsWithCommentByProductId(@Param("productId") Long productId);
    
    // Calculate average rating for a product
    @Query("SELECT AVG(r.rating) FROM ProductReview r WHERE r.product.id = :productId AND r.isApproved = true")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
    
    // Find pending reviews (for admin approval)
    List<ProductReview> findByIsApprovedFalse();
    
    // Check if user already reviewed a product
    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
