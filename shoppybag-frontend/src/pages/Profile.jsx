import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/api'
import { ToastContext } from '../Context/ToastContext'
import '../styles/profile.css'

function AccountView({profile, onChangePassword}){
  return (
    <div className="profile-card-fashion">
      <div className="profile-header-fashion">
        <div className="profile-avatar-fashion">
          <i className="bi bi-person"></i>
        </div>
        <div>
          <h4 className="profile-name-fashion">{profile.fullname}</h4>
          <p className="profile-email-fashion">{profile.email}</p>
        </div>
      </div>
      
      <div className="profile-details-fashion">
        <div className="detail-row-fashion">
          <span className="detail-label-fashion">
            <i className="bi bi-person me-3"></i>
            Full Name
          </span>
          <span className="detail-value-fashion">{profile.fullname}</span>
        </div>
        <div className="detail-row-fashion">
          <span className="detail-label-fashion">
            <i className="bi bi-envelope me-3"></i>
            Email Address
          </span>
          <span className="detail-value-fashion">{profile.email}</span>
        </div>
        <div className="detail-row-fashion">
          <span className="detail-label-fashion">
            <i className="bi bi-shield-lock me-3"></i>
            Password
          </span>
          <button className="change-password-btn-fashion" onClick={onChangePassword}>
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}

function AddressesView({addresses, onAddAddress, onDeleteAddress}){
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ line1: '', line2: '', state: '', country: '', pincode: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await onAddAddress(formData)
    setFormData({ line1: '', line2: '', state: '', country: '', pincode: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="addresses-header-fashion">
        <h4>Saved Addresses</h4>
        {!showForm && (
          <button className="add-address-btn-fashion" onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg me-2"></i>
            Add New Address
          </button>
        )}
      </div>

      {addresses.length === 0 && !showForm ? (
        <div className="empty-addresses-fashion">
          <div className="empty-icon-fashion">
            <i className="bi bi-geo-alt"></i>
          </div>
          <h5>No Saved Addresses</h5>
          <p className="text-muted mb-0">Add a delivery address to get started with your orders</p>
        </div>
      ) : (
        <div className="addresses-grid-fashion">
          {addresses.map(a => (
            <div key={a.id} className="address-card-fashion">
              <div className="address-icon-fashion">
                <i className="bi bi-house-door"></i>
              </div>
              <div className="address-content-fashion">
                <div className="address-line-1">{a.line1}</div>
                {a.line2 && <div className="address-line-2">{a.line2}</div>}
                <div className="address-location">{a.state} - {a.pincode}</div>
                <div className="address-country">{a.country}</div>
              </div>
              <button className="delete-address-btn-fashion" onClick={() => onDeleteAddress(a.id)} title="Delete address">
                <i className="bi bi-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="address-form-fashion">
          <div className="form-header-fashion">
            <h5>Add New Address</h5>
            <button className="close-form-btn" onClick={() => setShowForm(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-row-fashion">
              <div className="form-group-fashion">
                <label className="form-label-fashion">Address Line 1 *</label>
                <input 
                  className="form-input-fashion" 
                  placeholder="Street address, P.O. box" 
                  value={formData.line1} 
                  onChange={(e) => setFormData({...formData, line1: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group-fashion">
                <label className="form-label-fashion">Address Line 2</label>
                <input 
                  className="form-input-fashion" 
                  placeholder="Apartment, suite, unit, building" 
                  value={formData.line2} 
                  onChange={(e) => setFormData({...formData, line2: e.target.value})} 
                />
              </div>
            </div>
            <div className="form-row-fashion">
              <div className="form-group-fashion">
                <label className="form-label-fashion">State *</label>
                <input 
                  className="form-input-fashion" 
                  placeholder="State" 
                  value={formData.state} 
                  onChange={(e) => setFormData({...formData, state: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group-fashion">
                <label className="form-label-fashion">Pincode *</label>
                <input 
                  className="form-input-fashion" 
                  placeholder="Pincode" 
                  value={formData.pincode} 
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})} 
                  required 
                />
              </div>
            </div>
            <div className="form-group-fashion">
              <label className="form-label-fashion">Country *</label>
              <input 
                className="form-input-fashion" 
                placeholder="Country" 
                value={formData.country} 
                onChange={(e) => setFormData({...formData, country: e.target.value})} 
                required 
              />
            </div>
            <div className="form-actions-fashion">
              <button className="btn-save-fashion" type="submit">
                <i className="bi bi-check-lg me-2"></i>
                Save Address
              </button>
              <button type="button" className="btn-cancel-fashion" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default function Profile(){
  const [searchParams] = useSearchParams()
  const [active, setActive] = useState('account')
  const [profile, setProfile] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [showChange, setShowChange] = useState(false)
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    loadProfile()
    loadAddresses()
  }, [])

  useEffect(() => {
    const view = searchParams.get('view')
    if(view === 'addresses') setActive('addresses')
    else setActive('account')
  }, [searchParams])

  const loadProfile = async () => {
    try {
      const res = await api.get('/users/profile')
      if (res?.data?.data) {
        setProfile(res.data.data)
      }
    } catch (err) {
      console.error('Failed to load profile', err)
      showToast('Failed to load profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const loadAddresses = async () => {
    try {
      const res = await api.get('/address/my')
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setAddresses(res.data.data)
      } else if (res?.data?.data) {
        setAddresses([res.data.data])
      }
    } catch (err) {
      console.error('Failed to load addresses', err)
      setAddresses([])
    }
  }

  const handleAddAddress = async (formData) => {
    try {
      const res = await api.post('/address/add', formData)
      if (res?.data?.data) {
        setAddresses([...addresses, res.data.data])
        showToast('Address added successfully!', 'success')
      }
    } catch (err) {
      console.error('Failed to add address', err)
      showToast('Failed to add address', 'error')
    }
  }

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/address/delete/${id}`)
      setAddresses(addresses.filter(a => a.id !== id))
      showToast('Address deleted', 'success')
    } catch (err) {
      console.error('Failed to delete address', err)
      showToast('Failed to delete address', 'error')
    }
  }

  const handleChangePassword = () => setShowChange(true)

  const submitPassword = (e) => {
    e.preventDefault()
    if(passwordData.new !== passwordData.confirm) {
      showToast('Passwords do not match', 'error')
      return
    }
    showToast('Password change functionality coming soon', 'info')
    setShowChange(false)
    setPasswordData({ current: '', new: '', confirm: '' })
  }

  if (loading) return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 profile-page-fashion d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{width: '3rem', height: '3rem'}} role="status"></div>
          <div className="mt-3 text-muted fw-medium">Loading your profile...</div>
        </div>
      </main>
      <Footer />
    </div>
  )

  if (!profile) return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 profile-page-fashion">
        <div className="container py-5">
          <div className="alert alert-warning text-center p-5 rounded-4 shadow-sm border-0">
            <i className="bi bi-exclamation-triangle-fill text-warning display-4 mb-3"></i>
            <h4>Session Expired</h4>
            <p className="mb-0">Failed to load profile. Please log in again.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 profile-page-fashion">
        <div className="container py-5">
          <div className="profile-header-section">
            <h2 className="profile-main-title">My Account</h2>
            <p className="profile-main-subtitle">Manage your personal information and preferences</p>
          </div>

          <div className="row g-5">
            {/* Sidebar Navigation */}
            <div className="col-lg-3">
              <div className="profile-sidebar-fashion">
                <button 
                  className={`sidebar-item-fashion ${active==='account'?'active':''}`} 
                  onClick={()=>setActive('account')}
                >
                  <i className="bi bi-person-circle"></i>
                  Account Details
                </button>
                <button 
                  className={`sidebar-item-fashion ${active==='addresses'?'active':''}`} 
                  onClick={()=>setActive('addresses')}
                >
                  <i className="bi bi-geo-alt"></i>
                  My Addresses
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-9">
              {active === 'account' ? (
                <div>
                  <AccountView profile={profile} onChangePassword={handleChangePassword} />

                  {showChange && (
                    <div className="password-change-card-fashion mt-4">
                      <div className="form-header-fashion">
                        <h5>Change Password</h5>
                        <button className="close-form-btn" onClick={()=>setShowChange(false)}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                      <form onSubmit={submitPassword}>
                        <div className="form-group-fashion">
                          <label className="form-label-fashion">Current Password</label>
                          <input 
                            className="form-input-fashion" 
                            type="password" 
                            placeholder="Enter current password" 
                            value={passwordData.current}
                            onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="form-group-fashion">
                          <label className="form-label-fashion">New Password</label>
                          <input 
                            className="form-input-fashion" 
                            type="password" 
                            placeholder="Enter new password" 
                            value={passwordData.new}
                            onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="form-group-fashion">
                          <label className="form-label-fashion">Confirm New Password</label>
                          <input 
                            className="form-input-fashion" 
                            type="password" 
                            placeholder="Confirm new password" 
                            value={passwordData.confirm}
                            onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                            required 
                          />
                        </div>
                        <div className="form-actions-fashion">
                          <button className="btn-save-fashion" type="submit">
                            <i className="bi bi-check-lg me-2"></i>
                            Update Password
                          </button>
                          <button type="button" className="btn-cancel-fashion" onClick={()=>setShowChange(false)}>
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <AddressesView addresses={addresses} onAddAddress={handleAddAddress} onDeleteAddress={handleDeleteAddress} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
