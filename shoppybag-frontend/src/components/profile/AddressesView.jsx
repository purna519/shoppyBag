import React, { useState } from 'react'

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

export default AddressesView
