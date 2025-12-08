import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import { useCart } from '../Context/CartContext';
import { ToastContext } from '../Context/ToastContext';
import api from '../api/api';
import '../styles/checkout.css';

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = async () => {
    try {
      const res = await api.get('/api/address/my')
      if (res?.data?.data && Array.isArray(res.data.data)) {
        console.log('Addresses from backend:', res.data.data)
        console.log('First address:', res.data.data[0])
        setAddresses(res.data.data)
        if (res.data.data.length > 0) {
          setSelectedAddress(res.data.data[0].id)
        }
      }
    } catch (err) {
      console.error('Failed to load addresses', err)
    }
  }

  const calculateTotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      showToast('Please select a delivery address', 'warning');
      return
    }

    if (!cart?.items?.length) {
      showToast('Your cart is empty', 'warning');
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return navigate('/login')
      }

      // 1) Place order on server
      const placeRes = await api.post('/api/orders/place')
      const orderId = placeRes.data?.data?.id

      if (!orderId) {
        throw new Error('No orderId returned from server')
      }

      // 2) Initiate payment based on selected method
      if (paymentMethod === 'COD') {
        await handleCODPayment(orderId, token)
      } else {
        await handleOnlinePayment(orderId, token)
      }
    } catch (err) {
      console.error('Order error:', err)
      showToast(`Order failed: ${err.message}`, 'error');
      setLoading(false)
    }
  }

  const handleCODPayment = async (orderId, token) => {
    try {
      const base = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
      console.log('Initiating COD payment for order:', orderId)
      
      const res = await fetch(`${base}/payment/initiate/${orderId}?method=COD`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      })

      console.log('COD response status:', res.status)
      const data = await res.json()
      console.log('COD response data:', data)

      if (data.status === 'Success' || data.status === 'success') {
        navigate('/payment-success', { state: { orderId, method: 'COD' } })
      } else {
        throw new Error(data.message || 'COD confirmation failed')
      }
    } catch (err) {
      console.error('COD error details:', err)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      setLoading(false)
      showToast('COD order failed: ' + err.message, 'error');
    }
  }

  const handleOnlinePayment = async (orderId, token) => {
    try {
      // Open custom payment modal instead of Razorpay popup
      setOrderDetails({
        orderId: orderId,
        amount: calculateTotal()
      })
      setShowPaymentModal(true)
      setLoading(false)
    } catch (err) {
      console.error('Payment error:', err)
      setLoading(false)
      showToast('Payment failed: ' + err.message, 'error');
    }
  }

  const handlePaymentSuccess = (response) => {
    setShowPaymentModal(false)
    navigate('/payment-success', { state: { orderId: orderDetails.orderId, method: 'Online' } })
  }

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div>
      <Navbar />
      <main className="checkout-container">
        <div className="checkout-header">
          <h2>Checkout</h2>
          <p>Complete your purchase</p>
        </div>

        <div className="checkout-grid">
          {/* Left Column - Address & Payment */}
          <div className="checkout-left">
            {/* Delivery Address */}
            <div className="checkout-card">
              <div className="section-header">
                <i className="bi bi-geo-alt"></i>
                <h3>Delivery Address</h3>
              </div>

              {addresses.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-house-door"></i>
                  <p>No saved addresses</p>
                  <button className="btn-add" onClick={() => navigate('/profile?view=addresses')}>
                    Add Address
                  </button>
                </div>
              ) : (
                <div className="address-list">
                  {addresses.map(addr => (
                    <label key={addr.id} className={`address-card ${selectedAddress === addr.id ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={() => setSelectedAddress(addr.id)}
                      />
                      <div className="address-content">
                        <div className="address-name">{addr.line1}</div>
                        <div className="address-text">
                          {addr.line2}
                          {addr.line2 && addr.state && ', '}
                          {addr.state}
                          {addr.state && addr.country && ', '}
                          {addr.country}
                          {(addr.state || addr.country) && addr.pincode && ' - '}
                          {addr.pincode}
                        </div>
                      </div>
                      <i className="bi bi-check-circle-fill check-icon"></i>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="checkout-card">
              <div className="section-header">
                <i className="bi bi-credit-card"></i>
                <h3>Payment Method</h3>
              </div>

              <div className="payment-options">
                <label className={`payment-card ${paymentMethod === 'razorpay' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">💳</div>
                    <div>
                      <div className="payment-name">Online Payment</div>
                      <div className="payment-desc">UPI, Cards, Net Banking, Wallets</div>
                    </div>
                  </div>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                </label>

                <label className={`payment-card ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div className="payment-content">
                    <div className="payment-icon">💵</div>
                    <div>
                      <div className="payment-name">Cash on Delivery</div>
                      <div className="payment-desc">Pay when you receive</div>
                    </div>
                  </div>
                  <i className="bi bi-check-circle-fill check-icon"></i>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="checkout-right">
            <div className="checkout-card summary-card">
              <h3>Order Summary</h3>

              <div className="order-items">
                {cart?.items?.map((item, idx) => (
                  <div key={idx} className="summary-item">
                    <img src={item.variant?.imageUrl || item.product?.imageUrl} alt={item.product?.name} />
                    <div className="item-details">
                      <div className="item-name">{item.product?.name}</div>
                      <div className="item-meta">Size: {item.variant?.size} • Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-badge">FREE</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">
                <span>Total</span>
                <span>{formatPrice(calculateTotal())}</span>
              </div>

              <button 
                className="btn-place-order" 
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddress || !cart?.items?.length}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span> Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === 'COD' ? 'Place Order (COD)' : 'Proceed to Payment'}
                  </>
                )}
              </button>

              <div className="secure-badge">
                <i className="bi bi-shield-check"></i>
                <span>Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Custom Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        orderDetails={orderDetails}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
