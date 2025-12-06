import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import { ToastContext } from '../Context/ToastContext'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useContext(ToastContext)
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const res = await api.post('/api/users/signin', { email, password })
      if(res?.data?.status === 'success'){
        const token = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('authToken', token) // For admin routes
        
        // Decode JWT to check role
        try {
          const payload = JSON.parse(atob(token.split('.')[1]))
          const role = payload.role
          
          showToast('Login successful', 'success')
          
          // Redirect based on role
          if (role === 'ADMIN') {
            navigate('/admin/dashboard')
          } else {
            navigate('/')
          }
          
          // reload to let contexts pick up token
          setTimeout(()=> window.location.reload(), 200)
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError)
          showToast('Login successful', 'success')
          navigate('/')
          setTimeout(()=> window.location.reload(), 200)
        }
      } else {
        showToast(res?.data?.message || 'Login failed', 'error')
      }
    }catch(err){
      showToast('Login request failed', 'error')
    }finally{ setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Image/Branding */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-brand-logo">
              <i className="bi bi-bag-heart-fill"></i>
            </div>
            <h1 className="auth-visual-title">ShoppyBag</h1>
            <p className="auth-visual-subtitle">Your Premium Fashion Destination</p>
            
            <div className="auth-visual-features">
              <div className="feature-item">
                <div className="feature-icon gradient-purple">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <div className="feature-text">
                  <h4>Fast Delivery</h4>
                  <p>Get your orders delivered quickly</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon gradient-blue">
                  <i className="bi bi-shield-fill-check"></i>
                </div>
                <div className="feature-text">
                  <h4>Secure Payments</h4>
                  <p>100% safe and encrypted transactions</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon gradient-pink">
                  <i className="bi bi-award-fill"></i>
                </div>
                <div className="feature-text">
                  <h4>Premium Quality</h4>
                  <p>Exclusive collections just for you</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Sign in to continue shopping</p>
            </div>

            <form onSubmit={submit} className="auth-form">
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope input-icon"></i>
                  <input
                    className="form-input"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={e=>setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <i className="bi bi-lock input-icon"></i>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e=>setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <i className="bi bi-arrow-right ms-2"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-footer-text">
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">Create Account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
