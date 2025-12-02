import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CartPage from './pages/Cart'
import Checkout from './pages/Checkout'
import Profile from './pages/Profile'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import PaymentSuccess from './pages/PaymentSuccess'
import PaymentFailed from './pages/PaymentFailed'
import SearchPage from './pages/SearchPage'

export default function App(){
  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/checkout" element={<Checkout/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/payment-success" element={<PaymentSuccess/>} />
        <Route path="/payment-failed" element={<PaymentFailed/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/search" element={<SearchPage/>} />
      </Routes>
    </div>
  )
}
