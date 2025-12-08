import React, { useState, useEffect } from 'react'
import StarRating from './StarRating'
import api from '../api/api'
import '../styles/review-form.css'

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const storageKey = `review-draft-${productId}`
  
  // Rating always starts at 0 on mount/reload
  const [rating, setRating] = useState(0)
  
  // Comment is loaded from localStorage if available
  const [comment, setComment] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      return saved || ''
    } catch {
      return ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Save comment to localStorage whenever it changes
  useEffect(() => {
    try {
      if (comment) {
        localStorage.setItem(storageKey, comment)
      } else {
        localStorage.removeItem(storageKey)
      }
    } catch (err) {
      console.error('Failed to save review draft:', err)
    }
  }, [comment, storageKey])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Only rating is mandatory
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    // Review text is optional - no need to check

    try {
      setLoading(true)
      setError('')
      
      await api.post('/api/reviews', {
        productId,
        rating,
        comment: comment.trim() || '' // Empty string if no comment
      })

      // Clear localStorage after successful submission
      localStorage.removeItem(storageKey)
      
      // Reset form
      setRating(0)
      setComment('')
      
      // Notify parent
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
      
      // Alert removed - parent component handles notification
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="review-form-container">
      <h3 className="review-form-title">Write Your Review</h3>
      <form onSubmit={handleSubmit}>
        <div className="review-form-group">
          <label className="review-form-label">Your Rating *</label>
          <div className="rating-selector">
            <StarRating
              rating={rating}
              interactive={true}
              onChange={setRating}
              size="2rem"
            />
            {rating > 0 && (
              <span className="rating-text">{rating} out of 5 stars</span>
            )}
          </div>
        </div>

        <div className="review-form-group">
          <label className="review-form-label">Your Review (Optional)</label>
          <textarea
            className="review-textarea"
            rows="5"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this product (optional). What did you like or dislike? How was the quality?"
            disabled={loading}
          ></textarea>
          <small className="review-hint">
            {comment ? `${comment.length} characters` : 'Review text is optional - you can submit with just a rating'}
          </small>
        </div>

        {error && (
          <div className="review-error">{error}</div>
        )}

        <button 
          type="submit" 
          className="review-submit-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
