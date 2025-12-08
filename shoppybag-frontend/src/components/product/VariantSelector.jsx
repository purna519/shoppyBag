import React from 'react';

const VariantSelector = ({ product, selectedVariant, setSelectedVariant }) => {
  if (!product?.variants || product.variants.length === 0) {
    return null;
  }

  // Get unique sizes from variants
  const uniqueSizes = [...new Set(product.variants.map(v => v.displayName))];

  if (uniqueSizes.length === 0) {
    return null;
  }

  return (
    <div className="product-options">
      <label className="option-label">Select Size</label>
      <div className="size-selector">
        {uniqueSizes.map((size, idx) => {
          const variant = product.variants.find(v => v.displayName === size);
          const isOutOfStock = variant?.stockQuantity === 0;
          const isSelected = selectedVariant?.displayName === size;
          
          return (
            <button
              key={idx}
              className={`size-btn ${isSelected ? 'active' : ''} ${isOutOfStock ? 'out-of-stock' : ''}`}
              onClick={() => setSelectedVariant(variant)}
              title={isOutOfStock ? 'Out of stock - Available soon' : `${variant?.stockQuantity} in stock`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;
