import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AccountView, AddressesView, OrdersView } from '../components/profile'
import api from '../api/api'
import { ToastContext } from '../Context/ToastContext'
import '../styles/profile.css'


export default function Profile(){
  const [searchParams] = useSearchParams()
  const [active, setActive] = useState('account')
  const [profile, setProfile] = useState(null)
  const [addresses, setAddresses] = useState([])
  const [orders, setOrders] = useState([])
  const [showChange, setShowChange] = useState(false)
  const [loading, setLoading] = useState(true)
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' })
  const { showToast } = useContext(ToastContext)

  useEffect(() => {
    loadProfile()
    loadAddresses()
    loadOrders()
  }, [])

  useEffect(() => {
    const view = searchParams.get('view')
    if(view === 'addresses') setActive('addresses')
    else if(view === 'orders') setActive('orders')
    else setActive('account')
  }, [searchParams])

  const loadProfile = async () => {
    try {
      const res = await api.get('/api/users/profile')
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
      const res = await api.get('/api/address/my')
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

  const loadOrders = async () => {
    try {
      const res = await api.get('/api/orders/history')
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setOrders(res.data.data)
      } else if (res?.data?.data) {
        setOrders([res.data.data])
      }
    } catch (err) {
      console.error('Failed to load orders', err)
      setOrders([])
    }
  }

  const handleAddAddress = async (formData) => {
    try {
      const res = await api.post('/api/address/add', formData)
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
      await api.delete(`/api/address/delete/${id}`)
      setAddresses(addresses.filter(a => a.id !== id))
      showToast('Address deleted', 'success')
    } catch (err) {
      console.error('Failed to delete address', err)
      showToast('Failed to delete address', 'error')
    }
  }

  const handleChangePassword = () => setShowChange(true)

  const handleUpdateProfile = async (fullname, profileImage) => {
    console.log('handleUpdateProfile called with:', { fullname, profileImage })
    try {
      let changesMade = false

      // Update fullname if changed
      if (fullname !== profile.fullname) {
        console.log('Name changed, calling API...')
        const res = await api.put('/api/users/update', { 
          email: profile.email, 
          fullname: fullname 
        })
        console.log('Name update response:', res?.data)
        if (res?.data?.status === 'success') {
          setProfile({...profile, fullname: fullname})
          showToast('Name updated successfully!', 'success')
          changesMade = true
        }
      }
      
      // Upload profile image if selected
      if (profileImage) {
        console.log('Image exists, uploading...', profileImage.name)
        const formData = new FormData()
        formData.append('file', profileImage)
        formData.append('email', profile.email)
        
        console.log('Calling upload API...')
        const res = await api.post('/api/profile-image/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        
        console.log('Upload response:', res?.data)
        if (res?.data?.status === 'success') {
          showToast('Profile image updated successfully!', 'success')
          loadProfile()
          changesMade = true
        }
      } else {
        console.log('No profileImage provided')
      }

      console.log('changesMade:', changesMade)
      if (!changesMade) {
        showToast('No changes to save', 'info')
      }
    } catch (err) {
      console.error('Failed to update profile', err)
      showToast(err.response?.data?.message || 'Failed to update profile', 'error')
    }
  }


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
                <button 
                  className={`sidebar-item-fashion ${active==='orders'?'active':''}`} 
                  onClick={()=>setActive('orders')}
                >
                  <i className="bi bi-bag-check"></i>
                  My Orders
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="col-lg-9">
              {active === 'account' ? (
                <div>
                  <AccountView profile={profile} onChangePassword={handleChangePassword} onUpdateProfile={handleUpdateProfile} />

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
              ) : active === 'addresses' ? (
                <AddressesView addresses={addresses} onAddAddress={handleAddAddress} onDeleteAddress={handleDeleteAddress} />
              ) : (
                <OrdersView orders={orders} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
