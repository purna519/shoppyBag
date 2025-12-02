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
      const res = await api.post('/auth/login', { email, password })
      if(res?.data?.status === 'success'){
        const token = res.data.data
        localStorage.setItem('token', token)
        showToast('Login successful', 'success')
        navigate('/')
        // reload to let contexts pick up token
        setTimeout(()=> window.location.reload(), 200)
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
            <h1 className="auth-visual-title">ShoppyBag</h1>
            <p className="auth-visual-subtitle">Your Premium Fashion Destination</p>
            <div className="auth-visual-features">
              <div className="feature-item">
                <i className="bi bi-check-circle-fill"></i>
                <span>Exclusive Collections</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-check-circle-fill"></i>
                <span>Fast Delivery</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-check-circle-fill"></i>
                <span>Secure Payments</span>
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
