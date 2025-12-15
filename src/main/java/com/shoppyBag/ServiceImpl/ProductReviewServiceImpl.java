package com.shoppyBag.ServiceImpl;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shoppyBag.DTO.ReviewRequest;
import com.shoppyBag.DTO.ReviewResponse;
import com.shoppyBag.Entity.Product;
import com.shoppyBag.Entity.ProductReview;
import com.shoppyBag.Entity.Users;
import com.shoppyBag.Repository.ProductRepository;
import com.shoppyBag.Repository.ProductReviewRepository;
import com.shoppyBag.Repository.UserRepository;
import com.shoppyBag.Repository.OrderRepository;
import com.shoppyBag.Service.ProductReviewService;

@Service
@Transactional
public class ProductReviewServiceImpl implements ProductReviewService {

    @Autowired
    private ProductReviewRepository reviewRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public ReviewResponse submitReview(ReviewRequest request, String userEmail) {
        // Find user by email
        Users user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        // Find product
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if user already reviewed this product
        if (reviewRepository.existsByProductIdAndUserId(product.getId(), user.getId())) {
            throw new RuntimeException("You have already reviewed this product");
        }
        
        // ✅ VERIFIED PURCHASE CHECK - Only allow reviews from users who purchased the product
        boolean hasPurchased = orderRepository.hasUserPurchasedProduct(user.getId(), product.getId());
        if (!hasPurchased) {
            throw new RuntimeException("You can only review products you have purchased and received");
        }

        // Create review
        ProductReview review = new ProductReview();
        review.setProduct(product);
        review.setUser(user);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setIsApproved(false); // Requires admin approval
        review.setIsVerifiedPurchase(true); // Always true since we verified the purchase
        review.setCreatedAt(LocalDateTime.now());

        ProductReview savedReview = reviewRepository.save(review);
        return mapToResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getApprovedReviewsByProduct(Long productId) {
        List<ProductReview> reviews = reviewRepository.findByProductIdAndIsApprovedTrue(productId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getProductRatingStats(Long productId) {
        Map<String, Object> stats = new HashMap<>();
        
        Double avgRating = reviewRepository.findAverageRatingByProductId(productId);
        Long ratingCount = reviewRepository.countByProductIdAndIsApprovedTrue(productId); // All ratings
        Long reviewCount = reviewRepository.countReviewsWithCommentByProductId(productId); // Only reviews with text
        
        stats.put("averageRating", avgRating != null ? Math.round(avgRating * 10) / 10.0 : 0.0);
        stats.put("ratingCount", ratingCount != null ? ratingCount : 0);
        stats.put("reviewCount", reviewCount != null ? reviewCount : 0);
        
        return stats;
    }

    @Override
    public List<ReviewResponse> getPendingReviews() {
        List<ProductReview> reviews = reviewRepository.findByIsApprovedFalse();
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public ReviewResponse approveReview(Long reviewId) {
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setIsApproved(true);
        review.setUpdatedAt(LocalDateTime.now());
        
        ProductReview updated = reviewRepository.save(review);
        return mapToResponse(updated);
    }

    @Override
    public void deleteReview(Long reviewId, String userEmail) {
        // Find the review
        ProductReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        // Find the requesting user
        Users user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Check if user owns the review or is an admin
        boolean isOwner = review.getUser().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());
        
        if (!isOwner && !isAdmin) {
            throw new RuntimeException("You don't have permission to delete this review");
        }
        
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public List<ReviewResponse> getReviewsByUser(Long userId) {
        List<ProductReview> reviews = reviewRepository.findByUserId(userId);
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getAllReviews() {
        List<ProductReview> reviews = reviewRepository.findAll();
        return reviews.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Helper method to map entity to DTO
    private ReviewResponse mapToResponse(ProductReview review) {
        return ReviewResponse.builder()
                .id(review.getId())
                .productId(review.getProduct().getId())
                .productName(review.getProduct().getName())
                .userId(review.getUser().getId())
                .userName(review.getUser().getFullname())
                .rating(review.getRating())
                .comment(review.getComment())
                .isApproved(review.getIsApproved())
                .isVerifiedPurchase(review.getIsVerifiedPurchase())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
