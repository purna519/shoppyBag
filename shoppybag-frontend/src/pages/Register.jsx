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
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: '', color: '' })
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { showToast } = useContext(ToastContext)
  const navigate = useNavigate()

  // Password validation requirements
  const getPasswordRequirements = (password) => {
    return {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  }

  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    const requirements = getPasswordRequirements(password)
    const fulfilledCount = Object.values(requirements).filter(Boolean).length
    
    if (fulfilledCount <= 2) {
      return { strength: 33, label: 'Weak', color: '#ef4444' }
    } else if (fulfilledCount <= 4) {
      return { strength: 66, label: 'Moderate', color: '#f59e0b' }
    } else {
      return { strength: 100, label: 'Strong', color: '#10b981' }
    }
  }

  // Validate password meets all requirements
  const isPasswordValid = (password) => {
    const requirements = getPasswordRequirements(password)
    return Object.values(requirements).every(Boolean)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // Update password strength when typing password
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value))
      setShowPasswordRequirements(value.length > 0)
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    
    // Validate password requirements
    if (!isPasswordValid(formData.password)) {
      showToast('Password does not meet security requirements', 'error')
      return
    }
    
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
      
      const res = await api.post('/api/users/register', registerData)
      
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
            <div className="auth-brand-logo">
              <i className="bi bi-bag-heart-fill"></i>
            </div>
            <h1 className="auth-visual-title">Join ShoppyBag</h1>
            <p className="auth-visual-subtitle">Start Your Fashion Journey Today</p>
            
            <div className="auth-visual-features">
              <div className="feature-item">
                <div className="feature-icon gradient-pink">
                  <i className="bi bi-gift-fill"></i>
                </div>
                <div className="feature-text">
                  <h4>Welcome Offers</h4>
                  <p>Exclusive deals for new members</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon gradient-purple">
                  <i className="bi bi-star-fill"></i>
                </div>
                <div className="feature-text">
                  <h4>Member Benefits</h4>
                  <p>Earn rewards with every purchase</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon gradient-blue">
                  <i className="bi bi-trophy-fill"></i>
                </div>
                <div className="feature-text">
                  <h4>Exclusive Access</h4>
                  <p>First access to new collections</p>
                </div>
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
                  <div className="input-wrapper">
                    <i className="bi bi-person input-icon"></i>
                    <input
                      className="form-input"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <div className="input-wrapper">
                    <i className="bi bi-person-fill input-icon"></i>
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
                  <label className="form-label">Password *</label>
                  <div className="input-wrapper password-wrapper">
                    <i className="bi bi-lock input-icon"></i>
                    <input
                      className="form-input"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setShowPasswordRequirements(true)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  
                  {/* Compact Password Requirements */}
                  {showPasswordRequirements && formData.password && (
                    <div className="password-requirements-compact">
                      {(() => {
                        const requirements = getPasswordRequirements(formData.password)
                        const allMet = Object.values(requirements).every(Boolean)
                        
                        return (
                          <>
                            {/* Strength Indicator */}
                            <div className={`requirement-item ${allMet ? 'success' : 'error'}`}>
                              <span className="req-icon">{allMet ? '✓' : '✗'}</span>
                              <span>Password strength: <strong>{passwordStrength.label || 'weak'}</strong></span>
                            </div>
                            
                            {/* Individual Requirements */}
                            <div className={`requirement-item ${requirements.minLength ? 'success' : 'pending'}`}>
                              <span className="req-icon">✓</span>
                              <span>At least 8 characters</span>
                            </div>
                            
                            <div className={`requirement-item ${requirements.hasUpperCase ? 'success' : 'pending'}`}>
                              <span className="req-icon">✓</span>
                              <span>One uppercase letter (A-Z)</span>
                            </div>
                            
                            <div className={`requirement-item ${requirements.hasLowerCase ? 'success' : 'pending'}`}>
                              <span className="req-icon">✓</span>
                              <span>One lowercase letter (a-z)</span>
                            </div>
                            
                            <div className={`requirement-item ${requirements.hasNumber ? 'success' : 'pending'}`}>
                              <span className="req-icon">✓</span>
                              <span>One number (0-9)</span>
                            </div>
                            
                            <div className={`requirement-item ${requirements.hasSpecialChar ? 'success' : 'pending'}`}>
                              <span className="req-icon">✓</span>
                              <span>Contains special character (!@#$%^&*)</span>
                            </div>
                          </>
                        )
                      })()}
                    </div>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div className="input-wrapper password-wrapper">
                    <i className="bi bi-lock-fill input-icon"></i>
                    <input
                      className="form-input"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <div className="password-mismatch">
                      <i className="bi bi-exclamation-circle"></i>
                      Passwords do not match
                    </div>
                  )}
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
