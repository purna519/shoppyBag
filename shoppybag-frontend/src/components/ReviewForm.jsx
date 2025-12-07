import React, { useState } from 'react'
import StarRating from './StarRating'
import api from '../api/api'

export default function ReviewForm({ productId, onReviewSubmitted }) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    
    if (!comment.trim()) {
      setError('Please write a comment')
      return
    }

    try {
      setLoading(true)
      setError('')
      
      await api.post('/api/reviews', {
        productId,
        rating,
        comment: comment.trim()
      })

      // Reset form
      setRating(0)
      setComment('')
      
      // Notify parent
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
      
      alert('Review submitted successfully! It will be visible after admin approval.')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="review-form-container">
      <h5 className="mb-3">Write a Review</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-semibold">Your Rating</label>
          <div>
            <StarRating
              rating={rating}
              interactive={true}
              onChange={setRating}
              size="1.5rem"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label fw-semibold">Your Review</label>
          <textarea
            className="form-control"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this product..."
            disabled={loading}
          ></textarea>
        </div>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  )
}
