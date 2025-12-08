import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ReviewForm from '../ReviewForm'
import '../../styles/profile-orders.css'
import '../../styles/order-detail-modal.css'

function OrdersView({orders}) {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [reviewingProduct, setReviewingProduct] = useState(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date unavailable'
    
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'Invalid Date'
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const handleReviewSubmitted = () => {
    setReviewingProduct(null)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 5000) // Hide after 5 seconds
  }

  return (
    <div>
      <div className="orders-header-fashion">
        <h4>My Orders</h4>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders-fashion">
          <div className="empty-icon-fashion">
            <i className="bi bi-bag-x"></i>
          </div>
          <h5>No Orders Yet</h5>
          <p className="text-muted mb-0">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="orders-grid-fashion">
          {orders.map((order, index) => (
            <div key={order.id} className="order-card-fashion">
              <div className="order-header-fashion">
                <div>
                  <div className="order-id-fashion">Order #{index + 1}</div>
                  <div className="order-date-fashion">{formatDate(order.orderDate)}</div>
                </div>
                <div className={`order-status-badge ${order.status?.toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <div className="order-items-fashion">
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      {item.productVariant?.imageUrl && (
                        <img 
                          src={item.productVariant.imageUrl} 
                          alt={item.productVariant?.product?.name || 'Product'} 
                          className="order-item-image"
                        />
                      )}
                      <div className="order-item-details">
                        <div className="order-item-name">
                          {item.productVariant?.product?.name || item.productVariant?.sku || 'Product'}
                        </div>
                        {item.productVariant?.size && (
                          <div className="order-item-variant">Size: {item.productVariant.size}</div>
                        )}
                      </div>
                      <div className="order-item-quantity">Qty: {item.quantity || 1}</div>
                      <div className="order-item-price">{formatPrice(item.price)}</div>
                    </div>
                  ))
                ) : (
                  <div className="order-item-row">
                    <div className="order-item-details">
                      <div className="order-item-name">Order items unavailable</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="order-footer-fashion">
                <div className="order-total-fashion">
                  <span className="order-total-label">Total:</span>
                  <span className="order-total-amount">{formatPrice(order.totalAmount)}</span>
                </div>
                <button 
                  className="view-order-btn-fashion"
                  onClick={() => setSelectedOrder(order)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h4>Order Details</h4>
              <button className="close-modal-btn" onClick={() => setSelectedOrder(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body-custom">
              <div className="order-info-section">
                <div className="info-row">
                  <span className="info-label">Order Date:</span>
                  <span>{formatDate(selectedOrder.orderDate)}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Payment Status:</span>
                  <span className={`order-status-badge ${selectedOrder.status?.toLowerCase()}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Delivery Status:</span>
                  <span className={`order-status-badge delivery-${selectedOrder.deliveryStatus?.toLowerCase()}`}>
                    {selectedOrder.deliveryStatus || 'PENDING'}
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Total Amount:</span>
                  <span className="fw-bold">{formatPrice(selectedOrder.totalAmount)}</span>
                </div>
              </div>

              <h5 className="section-title-modal">Order Items</h5>
              <div className="order-items-detail">
                {selectedOrder.orderItems?.map((item, idx) => (
                  <div key={idx} className="order-item-detail-card">
                    <div className="item-detail-content">
                      {item.productVariant?.imageUrl && (
                        <img 
                          src={item.productVariant.imageUrl} 
                          alt={item.productVariant?.product?.name} 
                          className="item-detail-image"
                        />
                      )}
                      <div className="item-detail-info">
                        <h6>{item.productVariant?.productName || 'Product'}</h6>
                        <p className="text-muted small mb-1">
                          {item.productVariant?.size && `Size: ${item.productVariant.size}`}
                          {item.productVariant?.color && ` | Color: ${item.productVariant.color}`}
                        </p>
                        <p className="mb-0">Quantity: {item.quantity} × {formatPrice(item.price)}</p>
                      </div>
                    </div>
                    
                    {/* Review Button - Show for every product */}
                    <button 
                      className="review-btn-order"
                      onClick={() => {
                        const productId = item.productVariant?.productId;
                        const productName = item.productVariant?.productName || 'Product';
                        
                        if (!productId) {
                          console.error('No product ID found in productVariant:', item.productVariant);
                          alert('Unable to find product information. Please make sure backend is restarted.');
                          return;
                        }
                        
                        const product = {
                          id: productId,
                          name: productName
                        };
                        
                        setReviewingProduct(product);
                      }}
                    >
                      <i className="bi bi-star-fill me-2"></i>
                      Write a Review
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingProduct && (
        <div className="modal-overlay" onClick={() => setReviewingProduct(null)}>
          <div className="review-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h4>Review {reviewingProduct.name}</h4>
              <button className="close-modal-btn" onClick={() => setReviewingProduct(null)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="modal-body-custom">
              <ReviewForm 
                productId={reviewingProduct.id} 
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        </div>
      )}

      {/* Success Message Notification */}
      {showSuccessMessage && (
        <div className="review-success-notification">
          <div className="success-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="success-content">
            <h4>Review Submitted!</h4>
            <p>Thank you! Your review has been submitted and will appear after admin approval.</p>
          </div>
          <button className="close-success-btn" onClick={() => setShowSuccessMessage(false)}>
            <i className="bi bi-x"></i>
          </button>
        </div>
      )}
    </div>
  )
}

export default OrdersView
