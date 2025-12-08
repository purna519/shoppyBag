import React, { useState } from 'react'
import UPIPayment from './payment/UPIPayment'
import CardPayment from './payment/CardPayment'
import '../styles/payment-modal.css'

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onPaymentSuccess 
}) {
  const [activeTab, setActiveTab] = useState('upi') // 'upi', 'card'
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const { orderId, amount, currency = 'INR' } = orderDetails || {}

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="payment-modal-header">
          <div>
            <h3>Complete Payment</h3>
            <p className="payment-order-id">Order #{orderId}</p>
          </div>
          <button className="payment-modal-close" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Amount Display */}
        <div className="payment-amount-display">
          <span className="payment-amount-label">Total Amount</span>
          <span className="payment-amount-value">₹{amount?.toLocaleString('en-IN')}</span>
        </div>

        {/* Payment Method Tabs */}
        <div className="payment-tabs">
          <button 
            className={`payment-tab ${activeTab === 'upi' ? 'active' : ''}`}
            onClick={() => setActiveTab('upi')}
          >
            <i className="bi bi-qr-code"></i>
            UPI
          </button>
          <button 
            className={`payment-tab ${activeTab === 'card' ? 'active' : ''}`}
            onClick={() => setActiveTab('card')}
          >
            <i className="bi bi-credit-card"></i>
            Cards & More
          </button>
        </div>

        {/* Payment Content */}
        <div className="payment-content">
          {activeTab === 'upi' && (
            <UPIPayment 
              orderDetails={orderDetails}
              onPaymentSuccess={onPaymentSuccess}
              setLoading={setLoading}
            />
          )}
          
          {activeTab === 'card' && (
            <CardPayment 
              orderDetails={orderDetails}
              onPaymentSuccess={onPaymentSuccess}
              setLoading={setLoading}
            />
          )}
        </div>

        {/* Secure Payment Badge */}
        <div className="payment-security-badge">
          <i className="bi bi-shield-check"></i>
          <span>Payments are 100% secure and encrypted</span>
        </div>
      </div>
    </div>
  )
}
