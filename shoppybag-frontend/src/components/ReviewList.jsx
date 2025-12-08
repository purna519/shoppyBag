import React from 'react'
import StarRating from './StarRating'
import '../styles/review-list.css'

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-list-empty">
        <i className="bi bi-chat-quote"></i>
        <p>No reviews yet. Be the first to review this product!</p>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="reviews-list">
      {reviews.map((review) => (
        <div key={review.id} className="review-item">
          <div className="review-header">
            <div>
              <div className="review-user-name">
                {review.userName}
                {review.isVerifiedPurchase && (
                  <span className="verified-badge ms-2">
                    <i className="bi bi-patch-check-fill"></i> Verified Purchase
                  </span>
                )}
              </div>
              <StarRating rating={review.rating} size="0.9rem" />
            </div>
            <div className="review-date">{formatDate(review.createdAt)}</div>
          </div>
          <div className="review-comment">{review.comment}</div>
        </div>
      ))}
    </div>
  )
}
