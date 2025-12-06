import React from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function PaymentFailed(){
  return (
    <div>
      <Navbar />
      <main className="container py-5 text-center">
        <h2 className="text-danger">Payment Failed</h2>
        <p className="lead">Something went wrong while processing your payment.</p>
        <div className="mt-4">
          <Link to="/checkout" className="btn btn-primary">Try Again</Link>
          <Link to="/" className="btn btn-link">Continue Shopping</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
