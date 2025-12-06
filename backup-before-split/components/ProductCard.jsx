import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ p }) {
  const navigate = useNavigate()
  
  // Handle multiple image format possibilities from backend
  // Handle multiple image format possibilities from backend
  let rawUrl = (p.productImage && p.productImage[0]?.imageUrl) || 
                   (p.images && p.images[0]) || 
                   (p.productImages && p.productImages[0]?.imageUrl) ||
                   (p.image) || 
                   '/placeholder.png'
  
  // Heuristic: If it looks like an Amazon image ID but has no protocol, prepend Amazon URL
  // Otherwise if it's just a filename, assume it might be local or broken, fallback to placeholder on error
  let imageUrl = rawUrl
  if (rawUrl && !rawUrl.startsWith('http') && !rawUrl.startsWith('/')) {
     // Check if it looks like an amazon image file
     if (rawUrl.match(/^[A-Za-z0-9\-_]+\.jpg$/)) {
        imageUrl = `https://m.media-amazon.com/images/I/${rawUrl}`
     }
  }
  
  const handleNavigate = () => {
    navigate(`/product/${p.id}`)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(e) => { if (e.key === 'Enter') handleNavigate() }}
      className="h-100 product-card-wrapper"
    >
      <div className="card h-100 product-card border-0 shadow-sm">
        <div className="position-relative overflow-hidden">
            <img 
                src={imageUrl} 
                className="card-img-top product-card-img" 
                alt={p.name} 
            />
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate" title={p.name}>{p.name}</h6>
          <p className="text-muted small mb-2">{p.brand || 'Brand'} • {p.category || 'Category'}</p>
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div className="fw-bold product-price">₹{p.price || 'N/A'}</div>
            <button 
                className="btn btn-sm btn-primary" 
                onClick={(e) => { e.stopPropagation(); handleNavigate() }}
            >
                View
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
