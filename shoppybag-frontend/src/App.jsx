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
import AdminProtectedRoute from './components/AdminProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import ProductManagement from './pages/admin/ProductManagement'
import OrderManagement from './pages/admin/OrderManagement'
import ReviewManagement from './pages/admin/ReviewManagement'

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
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
        </Route>
      </Routes>
    </div>
  )
}
