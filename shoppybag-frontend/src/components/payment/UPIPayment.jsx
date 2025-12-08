import React, { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import api from '../../api/api'

export default function UPIPayment({ orderDetails, onPaymentSuccess, setLoading }) {
  const [upiId, setUpiId] = useState('')
  const [showQR, setShowQR] = useState(false)
  const [qrData, setQrData] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')

  const { orderId, amount } = orderDetails || {}

  // Generate QR Code for UPI
  const generateQRCode = () => {
    // Simple UPI intent URL - in production, replace with your actual UPI details
    const upiString = `upi://pay?pa=merchant@paytm&pn=ShoppyBag&am=${amount}&cu=INR&tn=Order${orderId}`
    setQrData(upiString)
    setShowQR(true)
  }

  // Handle UPI ID Payment
  const handleUPIPayment = async () => {
    if (!upiId || !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., yourname@paytm)')
      return
    }

    setError('')
    setLoading(true)
    setVerifying(true)

    try {
      const token = localStorage.getItem('token')
      
      // Step 1: Initiate payment to get Razorpay order
      const initResponse = await api.post(
        `/payment/initiate/${orderId}?method=UPI`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (initResponse.data.status !== 'success') {
        throw new Error(initResponse.data.message || 'Failed to initiate payment')
      }

      const paymentData = initResponse.data.data

      // Step 2: For test mode, simulate payment completion
      // In production, this would wait for actual UPI payment
      if (upiId === 'success@razorpay') {
        // Simulate successful payment for test UPI ID
        setTimeout(async () => {
          try {
            // Mock payment response
            const mockResponse = {
              razorpay_order_id: paymentData.razorpayOrderId,
              razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(7),
              razorpay_signature: 'mock_signature_for_testing'
            }

            // Verify payment (this will fail but order will be created)
            // In production, Razorpay sends actual webhook
            onPaymentSuccess(mockResponse)
            alert('Test Payment Successful! (In production, user would complete payment in their UPI app)')
          } catch (error) {
            console.error('Mock verification error:', error)
          }
        }, 2000)
      } else if (upiId === 'failure@razorpay') {
        setError('Payment failed! (Test failure UPI ID)')
        setVerifying(false)
        setLoading(false)
      } else {
        // Real UPI ID entered - show instructions
        setError('')
        alert(`Payment initiated!\n\nIn production:\n1. User receives payment request on ${upiId}\n2. User approves in their UPI app\n3. Razorpay webhook updates order status\n\nFor testing, use:\nsuccess@razorpay or failure@razorpay`)
        setVerifying(false)
        setLoading(false)
      }

    } catch (error) {
      console.error('UPI payment error:', error)
      setError('Payment initiation failed: ' + (error.response?.data?.message || error.message))
      setVerifying(false)
      setLoading(false)
    }
  }

  return (
    <div className="upi-payment-container">
      {/* Two Column Layout for UPI and QR */}
      <div className="upi-two-column-layout">
        {/* Left Column - UPI ID Input */}
        <div className="upi-column">
          <div className="upi-id-section">
            <h4>Enter UPI ID</h4>
            <div className="upi-id-input-group">
              <input
                type="text"
                className="upi-id-input"
                placeholder="yourname@okaxis"
                value={upiId}
                onChange={(e) => {
                  setUpiId(e.target.value)
                  setError('')
                }}
              />
              <button 
                className="upi-verify-btn"
                onClick={handleUPIPayment}
                disabled={verifying}
              >
                {verifying ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
            
            {error && <p className="upi-error">{error}</p>}
            
            <small className="upi-hint">
              Enter your UPI ID (e.g., username@paytm, mobile@ybl)
            </small>
          </div>
        </div>

        {/* Right Column - QR Code */}
        <div className="upi-column">
          <div className="upi-qr-section">
            <h4>Scan QR Code</h4>
            {!showQR ? (
              <button className="show-qr-btn" onClick={generateQRCode}>
                <i className="bi bi-qr-code-scan"></i>
                Generate QR
              </button>
            ) : (
              <div className="qr-code-display">
                <QRCodeSVG value={qrData} size={220} level="H" />
                <p className="qr-instruction">Scan with any UPI app</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Test Info - Full Width */}
      <div className="upi-test-info">
        <strong>Test Mode:</strong>
        <ul>
          <li><code>success@razorpay</code> - Simulates successful payment</li>
          <li><code>failure@razorpay</code> - Simulates failed payment</li>
        </ul>
      </div>

      {/* UPI Apps Info */}
      <div className="upi-apps-info">
        <p className="upi-apps-title">
          <i className="bi bi-info-circle"></i>
          Supported UPI Apps
        </p>
        <div className="upi-apps-list">
          <span className="upi-app-tag">Google Pay</span>
          <span className="upi-app-tag">PhonePe</span>
          <span className="upi-app-tag">Paytm</span>
          <span className="upi-app-tag">BHIM</span>
          <span className="upi-app-tag">Amazon Pay</span>
        </div>
        <small>Use any UPI app to scan QR or enter your UPI ID directly</small>
      </div>

      {verifying && (
        <div className="payment-verifying">
          <div className="spinner-border text-success" role="status"></div>
          <span>Processing payment...</span>
        </div>
      )}
    </div>
  )
}
