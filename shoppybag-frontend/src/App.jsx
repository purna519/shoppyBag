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
import PaymentFailure from './pages/PaymentFailure'
import SearchPage from './pages/SearchPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/cart" element={<ProtectedRoute><CartPage/></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess/></ProtectedRoute>} />
        <Route path="/payment-failed" element={<ProtectedRoute><PaymentFailure/></ProtectedRoute>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/search" element={<SearchPage/>} />
      </Routes>
    </div>
  )
}
