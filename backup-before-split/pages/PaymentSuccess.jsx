import React, { useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../Context/CartContext'
import '../styles/payment-pages.css'

export default function PaymentSuccess(){
  const { state } = useLocation()
  const orderId = state?.orderId
  const method = state?.method ||  'Online'
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear cart immediately on successful payment
    clearCart()
  }, [clearCart])

  return (
    <div>
      <Navbar />
      <main className="payment-page-container">
        <div className="payment-success-card">
          <div className="success-animation">
            <div className="checkmark-circle">
              <i className="bi bi-check-lg"></i>
            </div>
            <div className="confetti"></div>
          </div>

          <h1>Payment Successful!</h1>
          <p className="success-subtitle">Thank you for your order</p>

          <div className="order-info">
            <div className="info-row">
              <span className="label">Order ID:</span>
              <span className="value">#{orderId || 'N/A'}</span>
            </div>
            <div className="info-row">
              <span className="label">Payment Method:</span>
              <span className="value">{method}</span>
            </div>
            <div className="info-row">
              <span className="label">Status:</span>
              <span className="status-badge success">Confirmed</span>
            </div>
          </div>

          <div className="success-message">
            <i className="bi bi-envelope-check"></i>
            <p>A confirmation email has been sent to your registered email address</p>
          </div>

          <div className="action-buttons">
            <Link to="/profile?view=orders" className="btn-primary">
              <i className="bi bi-bag-check"></i>
              View My Orders
            </Link>
            <Link to="/" className="btn-secondary">
              <i className="bi bi-house"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
