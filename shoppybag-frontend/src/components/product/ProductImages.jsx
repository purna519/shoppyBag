import React from 'react';

const ProductImages = ({ images, mainIndex, setMainIndex, productName }) => {
  const displayImages = images || [];
  
  if (displayImages.length === 0) {
    return (
      <div className="product-gallery">
        <div className="gallery-main">
          <img src="/placeholder.png" alt={productName} />
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <img 
          src={displayImages[mainIndex] || '/placeholder.png'} 
          alt={productName}
        />
        {displayImages.length > 1 && (
          <>
            <button 
              className="gallery-nav gallery-nav-prev" 
              onClick={() => setMainIndex(i => (i - 1 + displayImages.length) % displayImages.length)}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button 
              className="gallery-nav gallery-nav-next" 
              onClick={() => setMainIndex(i => (i + 1) % displayImages.length)}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
      </div>

      <div className="gallery-thumbs">
        {displayImages.map((src, idx) => (
          <div 
            key={idx} 
            className={`gallery-thumb ${mainIndex === idx ? 'active' : ''}`}
            onClick={() => setMainIndex(idx)}
          >
            <img src={src} alt={`thumb-${idx}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;
