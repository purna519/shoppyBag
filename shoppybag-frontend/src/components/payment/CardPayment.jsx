import React, { useState } from 'react'
import api from '../../api/api'

export default function CardPayment({ orderDetails, onPaymentSuccess, setLoading }) {
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  })
  const [errors, setErrors] = useState({})

  const { orderId, amount } = orderDetails || {}

  // Note: This component triggers Razorpay popup with all payment options

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }

  // Format expiry date
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`
    }
    return v
  }

  // Handle input changes
  const handleChange = (field, value) => {
    let formattedValue = value

    if (field === 'number') {
      formattedValue = formatCardNumber(value)
    } else if (field === 'expiry') {
      formattedValue = formatExpiry(value)
    } else if (field === 'cvv') {
      formattedValue = value.replace(/[^0-9]/gi, '').slice(0, 4)
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Handle payment - Opens Razorpay popup with all payment options
  const handleCardPayment = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Create Razorpay order
      const orderResponse = await api.post(
        `/payment/initiate/${orderId}?method=razorpay`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (orderResponse.data.status !== 'success') {
        throw new Error(orderResponse.data.message || 'Failed to create order')
      }

      const orderData = orderResponse.data.data

      // Open Razorpay with all payment methods
      const options = {
        key: orderData.razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'ShoppyBag',
        description: `Order #${orderId}`,
        order_id: orderData.razorpayOrderId,
        handler: function (response) {
          verifyPayment(response)
        },
        theme: {
          color: '#16a34a'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed: ' + (error.response?.data?.message || error.message))
      setLoading(false)
    }
  }

  // Verify payment
  const verifyPayment = async (response) => {
    try {
      const verifyResponse = await api.post('/payment/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      })

      if (verifyResponse.data.status === 'Success') {
        onPaymentSuccess(response)
      } else {
        alert('Payment verification failed!')
      }
    } catch (error) {
      console.error('Verification error:', error)
      alert('Payment verification failed: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card-payment-container">
      <div className="payment-info-box">
        <i className="bi bi-info-circle"></i>
        <p>Click below to choose from multiple payment options:</p>
        <ul>
          <li>Credit/Debit Cards (Visa, Mastercard, RuPay)</li>
          <li>Net Banking (All major banks)</li>
          <li>Wallets (Paytm, Amazon Pay, Mobikwik)</li>
        </ul>
      </div>

      <button 
        className="payment-submit-btn"
        onClick={handleCardPayment}
      >
        <i className="bi bi-lock-fill"></i>
        Continue with Razorpay
      </button>

      <p className="secure-text">
        <i className="bi bi-shield-check"></i>
        Payments are processed securely by Razorpay
      </p>
    </div>
  )
}
