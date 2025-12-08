import React from 'react';
import RatingBreakdown from '../RatingBreakdown';
import DeliveryEstimate from '../DeliveryEstimate';
import VariantSelector from './VariantSelector';

const ProductInfo = ({ 
  product, 
  selectedVariant, 
  setSelectedVariant,
  quantity,
  setQuantity,
  ratingStats,
  handleAdd,
  stock
}) => {
  const formatPrice = (price) => `₹${price?.toLocaleString('en-IN')}`;
  
  const price = selectedVariant ? selectedVariant.price : (product.price || 0);
  const discount = product.discountPercentage || 0;
  const discountedPrice = Math.round(price * (1 - discount/100));

  return (
    <div className="product-info">
      <div className="product-brand">{product.brand}</div>
      <h1 className="product-title">{product.name}</h1>
      <p className="product-category">{product.category}</p>
      
      {/* Rating Display with Star Breakdown */}
      <RatingBreakdown ratingStats={ratingStats} />

      {/* Price */}
      <div className="product-price-section">
        {discount > 0 ? (
          <>
            <span className="price-current">{formatPrice(discountedPrice)}</span>
            <span className="price-original">{formatPrice(price)}</span>
            <span className="price-discount">-{discount}% OFF</span>
          </>
        ) : (
          <span className="price-current">{formatPrice(price)}</span>
        )}
      </div>

      {/* Delivery Estimate */}
      <DeliveryEstimate />

      {/* Size Selection */}
      <VariantSelector 
        product={product}
        selectedVariant={selectedVariant}
        setSelectedVariant={setSelectedVariant}
      />

      {/* Quantity */}
      <div className="product-options">
        <label className="option-label">Quantity</label>
        <div className="quantity-selector">
          <button 
            className="qty-btn" 
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          <span className="qty-value">{quantity}</span>
          <button 
            className="qty-btn" 
            onClick={() => setQuantity(q => q + 1)}
            disabled={quantity >= stock}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
        {stock < 10 && stock > 0 && (
          <span className="stock-warning">Only {stock} left in stock!</span>
        )}
      </div>

      {/* Add to Cart Button */}
      <div className="product-actions">
        <button 
          className="btn-add-to-cart"
          onClick={handleAdd}
          disabled={stock === 0}
        >
          {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductInfo;
