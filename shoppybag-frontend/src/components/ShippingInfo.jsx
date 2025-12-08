import React from 'react'

/**
 * ShippingInfo Component
 * Displays shipping details in collapsible section
 */
export default function ShippingInfo() {
  return (
    <div className="shipping-info">
      <div className="shipping-item">
        <i className="bi bi-truck"></i>
        <div>
          <strong>Free Delivery</strong>
          <p>Over ₹500</p>
        </div>
      </div>
      <div className="shipping-item">
        <i className="bi bi-box-seam"></i>
        <div>
          <strong>Standard Delivery</strong>
          <p>3-4 Working Days</p>
        </div>
      </div>
      <div className="shipping-item">
        <i className="bi bi-arrow-repeat"></i>
        <div>
          <strong>Easy Returns</strong>
          <p>15 days return policy</p>
        </div>
      </div>
    </div>
  )
}
