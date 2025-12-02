import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentSuccess(){
  const { state } = useLocation()
  const orderId = state?.orderId

  return (
    <div>
      <Navbar />
      <main className="container py-5 text-center">
        <h2 className="text-success">Payment Successful</h2>
        <p className="lead">Thank you! Your payment was successful.</p>
        {orderId && <p className="small">Order ID: <strong>{orderId}</strong></p>}
        <div className="mt-4">
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
          <Link to="/profile" className="btn btn-link">View Orders</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
