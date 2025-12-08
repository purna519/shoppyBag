import React from 'react'
import '../styles/star-rating.css'

export default function StarRating({ rating = 0, maxStars = 5, size = '1rem', interactive = false, onChange }) {
  const stars = []

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  for (let i = 1; i <= maxStars; i++) {
    const difference = rating - (i - 1)
    let starIcon
    
    if (difference >= 1) {
      // Full star
      starIcon = 'bi-star-fill'
    } else if (difference >= 0.5) {
      // Half star
      starIcon = 'bi-star-half'
    } else {
      // Empty star
      starIcon = 'bi-star'
    }
    
    const isFilled = i <= rating
    
    stars.push(
      <i
        key={i}
        className={`bi ${starIcon}`}
        style={{
          fontSize: size,
          color: (difference > 0) ? '#fbbf24' : '#e2e8f0',
          cursor: interactive ? 'pointer' : 'default',
          marginRight: '2px'
        }}
        onClick={() => handleClick(i)}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
      ></i>
    )
  }

  return (
    <div className="star-rating-container">
      {stars}
    </div>
  )
}
