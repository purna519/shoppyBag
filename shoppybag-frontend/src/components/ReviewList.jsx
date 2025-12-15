import React, { useState } from 'react'
import StarRating from './StarRating'
import ConfirmDialog from './ConfirmDialog'
import '../styles/review-list.css'

export default function ReviewList({ reviews, currentUserId, onDeleteReview }) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [reviewToDelete, setReviewToDelete] = useState(null)

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

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId)
    setShowConfirm(true)
  }

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      onDeleteReview(reviewToDelete)
      setReviewToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setShowConfirm(false)
    setReviewToDelete(null)
  }

  return (
    <>
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
            {currentUserId && currentUserId === review.userId && onDeleteReview && (
              <div className="review-actions">
                <button 
                  className="btn-delete-review"
                  onClick={() => handleDeleteClick(review.id)}
                  title="Delete this review"
                >
                  <i className="bi bi-trash"></i> Delete Review
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </>
  )
}
