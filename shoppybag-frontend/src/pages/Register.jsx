import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/api'
import { ToastContext } from '../Context/ToastContext'

export default function Register(){
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: ''
  })
  const [loading, setLoading] = useState(false)
  const { showToast } = useContext(ToastContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const submit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error')
      return
    }

    setLoading(true)
    try {
      const registerData = {
        fullname: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        passwordHash: formData.password,
        phoneNumber: formData.phoneNumber
      }
      
      const res = await api.post('/users/register', registerData)
      
      if (res?.data?.status === 'success' || res?.data?.status === 'Success') {
        showToast('Registration successful! Please login', 'success')
        navigate('/login')
      } else {
        showToast(res?.data?.message || 'Registration failed', 'error')
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration request failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Image/Branding */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <h1 className="auth-visual-title">Join ShoppyBag</h1>
            <p className="auth-visual-subtitle">Start Your Fashion Journey Today</p>
            <div className="auth-visual-features">
              <div className="feature-item">
                <i className="bi bi-gift-fill"></i>
                <span>Welcome Offers</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-star-fill"></i>
                <span>Member Benefits</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-trophy-fill"></i>
                <span>Exclusive Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-form-section">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2 className="auth-title">Create Account</h2>
              <p className="auth-subtitle">Join our fashion community</p>
            </div>

            <form onSubmit={submit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-input"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-input"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrapper">
                  <i className="bi bi-envelope input-icon"></i>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <div className="input-wrapper">
                  <i className="bi bi-phone input-icon"></i>
                  <input
                    className="form-input"
                    name="phoneNumber"
                    placeholder="+1 234 567 8900"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      className="form-input"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div className="input-wrapper">
                    <i className="bi bi-lock-fill input-icon"></i>
                    <input
                      className="form-input"
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <button className="auth-btn" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <i className="bi bi-arrow-right ms-2"></i>
                  </>
                )}
              </button>
            </form>

            <div className="auth-footer">
              <p className="auth-footer-text">
                Already have an account?{' '}
                <Link to="/login" className="auth-link">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
