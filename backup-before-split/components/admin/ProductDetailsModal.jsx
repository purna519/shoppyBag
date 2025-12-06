import React from 'react';

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content product-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Product Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="info-row">
            <span className="label">Product ID</span>
            <span className="value">#{product.id}</span>
          </div>

          <div className="info-row">
            <span className="label">Product Name</span>
            <span className="value">{product.name}</span>
          </div>

          <div className="info-row">
            <span className="label">Brand</span>
            <span className="value">{product.brand}</span>
          </div>

          <div className="info-row">
            <span className="label">Category</span>
            <span className="value">{product.category}</span>
          </div>

          <div className="info-row">
            <span className="label">Price</span>
            <span className="value price-value">₹{product.price?.toLocaleString('en-IN')}</span>
          </div>

          <div className="info-row">
            <span className="label">Stock Quantity</span>
            <span className={`value ${product.stockQuantity > 10 ? 'stock-high' : product.stockQuantity > 0 ? 'stock-medium' : 'stock-low'}`}>
              {product.stockQuantity} units
            </span>
          </div>

          <div className="info-row">
            <span className="label">Created At</span>
            <span className="value">{product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-IN') : 'N/A'}</span>
          </div>

          <div className="info-row description-row">
            <span className="label">Description</span>
            <span className="value description-value">{product.description || 'No description available'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
