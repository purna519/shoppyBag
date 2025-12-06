import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/payment-pages.css'

export default function PaymentFailure(){
  return (
    <div>
      <Navbar />
      <main className="payment-page-container">
        <div className="payment-failure-card">
          <div className="failure-animation">
            <div className="cross-circle">
              <i className="bi bi-x-lg"></i>
            </div>
          </div>

          <h1>Payment Failed</h1>
          <p className="failure-subtitle">We couldn't process your payment</p>

          <div className="failure-message">
            <i className="bi bi-exclamation-circle"></i>
            <div>
              <p className="message-title">Common reasons for payment failure:</p>
              <ul>
                <li>Insufficient funds in your account</li>
                <li>Incorrect card details or expired card</li>
                <li>Network or bank server issues</li>
                <li>Payment cancelled by user</li>
              </ul>
            </div>
          </div>

          <div className="action-buttons">
            <Link to="/cart" className="btn-primary">
              <i className="bi bi-arrow-left-circle"></i>
              Back to Cart
            </Link>
            <Link to="/" className="btn-secondary">
              <i className="bi bi-house"></i>
              Go to Home
            </Link>
          </div>

          <div className="help-text">
            <i className="bi bi-question-circle"></i>
            <p>Need help? <a href="/contact">Contact Support</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
