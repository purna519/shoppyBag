import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../Context/CartContext'
import api from '../api/api'

// Helper: dynamically load Razorpay script
const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })

export default function Checkout() {
  const { cart } = useCart()
  const navigate = useNavigate()

  const handlePay = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No token found')
        return navigate('/login')
      }

      console.log('Step 1: Placing order...')
      // 1) Place order on server (server will build order from user's cart)
      const placeRes = await api.post('/orders/place')
      console.log('Place order response:', placeRes)
      
      if (!placeRes || placeRes.status !== 200) {
        console.error('Failed to place order, response:', placeRes)
        throw new Error('Failed to place order')
      }
      
      // OrderDTO has 'id' field, not 'orderId'
      const orderId = placeRes.data?.data?.id || placeRes.data?.id || null
      console.log('Order ID received:', orderId)
      
      if (!orderId) {
        console.error('No orderId in response:', placeRes.data)
        throw new Error('No orderId returned from server')
      }

      console.log('Step 2: Initiating payment for order:', orderId)
      // 2) Initiate payment (this endpoint is top-level /payment)
      const base = import.meta.env.VITE_API_HOST || 'http://localhost:8080'
      const initRes = await fetch(`${base}/payment/initiate/${orderId}?method=razorpay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      })
      
      console.log('Payment initiate response status:', initRes.status)
      const initJson = await initRes.json()
      console.log('Payment initiate response:', initJson)
      
      // Check if backend returned an error
      if (initJson.status === 'error' || initJson.status === 'Error') {
        console.error('Backend error:', initJson.message)
        throw new Error(`Backend error: ${initJson.message}`)
      }
      
      if (!initJson) {
        console.error('Invalid initiate response')
        throw new Error('Invalid initiate response')
      }

      // backend returns map under `data` or at root depending on ApiResponse wrapper
      const payload = initJson.data || initJson
      console.log('Payment payload:', payload)
      
      const razorpayOrderId = payload.razorpayOrderId || payload.razorpay_order_id || payload.orderId
      const razorpayKey = payload.razorpayKey || payload.razorpay_key || payload.key
      const amount = payload.amount || payload.total || payload.value
      
      console.log('Razorpay details:', { razorpayOrderId, razorpayKey, amount })
      
      if (!razorpayOrderId || !razorpayKey) {
        console.error('Missing razorpay details. Full payload:', payload)
        throw new Error('Missing razorpay details')
      }

      console.log('Step 3: Loading Razorpay script...')
      // 3) Load Razorpay script
      const loaded = await loadRazorpay()
      if (!loaded) {
        console.error('Failed to load Razorpay SDK')
        throw new Error('Failed to load Razorpay SDK')
      }
      console.log('Razorpay loaded successfully')

      console.log('Step 4: Opening Razorpay checkout...')
      // 4) Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: payload.currency || 'INR',
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            console.log('Payment successful, verifying...', response)
            // response contains: razorpay_order_id, razorpay_payment_id, razorpay_signature
            const verifyBody = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }

            // 5) Verify with backend
            const verifyRes = await fetch(`${base}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(verifyBody),
            })
            const verifyJson = await verifyRes.json()
            console.log('Verification response:', verifyJson)
            
            // Check if backend returned success - matching actual backend response structure
            if (verifyJson && (verifyJson.status === 'Success' || verifyJson.status === 'success') && verifyJson.data === 'VALID') {
              // success
              console.log('Payment verified successfully')
              navigate('/payment-success', { state: { orderId } })
            } else {
              console.error('Payment verification failed:', verifyJson)
              navigate('/payment-failed')
            }
          } catch (err) {
            console.error('Verify error', err)
            navigate('/payment-failed')
          }
        },
        prefill: {},
        theme: { color: '#0d6efd' },
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error('Payment error:', err)
      console.error('Error details:', err.message, err.stack)
      alert(`Payment failed: ${err.message}`)
      navigate('/payment-failed')
    }
  }

  return (
    <div>
      <Navbar />
      <main className="container py-5">
        <h3>Checkout</h3>
        <p className="text-muted">This will place an order using the server-side cart and then open Razorpay checkout.</p>
        <p className="text-muted">Make sure you're logged in and the backend is running on port 8080.</p>
        <div className="mt-4">
          <button className="btn btn-primary" onClick={handlePay} disabled={!cart?.items?.length}>
            Pay Now
          </button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
