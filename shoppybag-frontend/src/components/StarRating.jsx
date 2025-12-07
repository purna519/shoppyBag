import React from 'react'

export default function StarRating({ rating = 0, maxStars = 5, size = '1rem', interactive = false, onChange }) {
  const stars = []

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value)
    }
  }

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= rating
    const starClass = isFilled ? 'bi-star-fill' : 'bi-star'
    
    stars.push(
      <i
        key={i}
        className={`bi ${starClass}`}
        style={{
          fontSize: size,
          color: isFilled ? '#FFD700' : '#cbd5e1',
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
    <div className="star-rating d-inline-flex align-items-center">
      {stars}
      {rating > 0 && !interactive && (
        <span className="ms-2" style={{ fontSize: '0.875rem', color: '#64748b' }}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
