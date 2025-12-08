import React from 'react'

/**
 * RatingBreakdown Component
 * Displays rating summary and star distribution bars
 */
export default function RatingBreakdown({ ratingStats }) {
  if (!ratingStats || ratingStats.averageRating === 0) {
    return null
  }

  const getRatingDistribution = () => {
    if (!ratingStats?.ratingDistribution) return null
    const total = ratingStats.ratingCount || 0
    if (total === 0) return null
    
    return [5, 4, 3, 2, 1].map(star => {
      const count = ratingStats.ratingDistribution[star] || 0
      const percentage = (count / total) * 100
      return { star, count, percentage }
    })
  }

  const ratingDistribution = getRatingDistribution()

  return (
    <div className="product-rating-enhanced">
      <div className="rating-summary-inline">
        <span className="rating-value">{ratingStats.averageRating.toFixed(1)}</span>
        <span className="rating-star">★</span>
        <span className="rating-count">({ratingStats.ratingCount}) Ratings</span>
        <span className="rating-separator"> & </span>
        <span className="review-count">({ratingStats.reviewCount}) Reviews</span>
      </div>
      
      {ratingDistribution && (
        <div className="rating-breakdown">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="rating-bar-row">
              <span className="star-label">{star}</span>
              <i className="bi bi-star-fill star-icon"></i>
              <div className="rating-bar">
                <div className="rating-bar-fill" style={{ width: `${percentage}%` }}></div>
              </div>
              <span className="rating-count-small">{count}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
