import React from 'react'
import '../../styles/profile-orders.css'

function OrdersView({orders}) {
  // Debug: Log the orders data to see the actual structure
  React.useEffect(() => {
    console.log('Orders received:', orders)
    if (orders.length > 0) {
      console.log('First order structure:', orders[0])
      console.log('First order keys:', Object.keys(orders[0]))
    }
  }, [orders])

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date unavailable'
    
    // Handle timestamp format from DB: "2025-12-01 16:43:54.437411"
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return 'Invalid Date'
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      console.error('Date parsing error:', error)
      return 'Invalid Date'
    }
  }

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
                <button className="view-order-btn-fashion">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersView
