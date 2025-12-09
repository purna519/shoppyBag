import React, { useState, useEffect } from 'react'

function AccountView({profile, onChangePassword, onUpdateProfile}){
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ fullname: '' })
  const [profileImage, setProfileImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (profile?.fullname) {
      setEditData({ fullname: profile.fullname })
    }
  }, [profile])

  const handleImageChange = (e) => {
    console.log('File input changed:', e.target.files)
    const file = e.target.files[0]
    console.log('Selected file:', file)
    if (file) {
      console.log('Setting profile image:', file.name, file.size, file.type)
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log('FileReader finished, setting preview')
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected')
    }
  }

  const handleSave = async () => {
    console.log('=== SAVE CLICKED ===')
    console.log('profileImage state:', profileImage)
    console.log('hasImage:', !!profileImage)
    console.log('imageName:', profileImage?.name)
    
    await onUpdateProfile(editData.fullname, profileImage)
    setIsEditing(false)
    setProfileImage(null)
    setImagePreview(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({ fullname: profile.fullname })
    setProfileImage(null)
    setImagePreview(null)
  }

  return (
    <div className="profile-card-fashion">
      <div className="profile-header-fashion">
        <div className="profile-avatar-fashion">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
          ) : profile.profileImageUrl ? (
            <img src={`http://localhost:8080/api/profile-image/${profile.email}`} alt="Profile" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%'}} />
          ) : (
            <i className="bi bi-person"></i>
          )}
        </div>
        <div>
          <h4 className="profile-name-fashion">{profile.fullname}</h4>
          <p className="profile-email-fashion">{profile.email}</p>
        </div>
      </div>
      
      {!isEditing ? (
        <>
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
          <div className="mt-3">
            <button className="btn-save-fashion w-100" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-2"></i>
              Edit Profile
            </button>
          </div>
        </>
      ) : (
        <div className="profile-details-fashion">
          <div className="form-group-fashion mb-3">
            <label className="form-label-fashion">Full Name</label>
            <input
              className="form-input-fashion"
              type="text"
              value={editData.fullname}
              onChange={(e) => setEditData({...editData, fullname: e.target.value})}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group-fashion mb-3">
            <label className="form-label-fashion">Email Address (Read-only)</label>
            <input
              className="form-input-fashion"
              type="email"
              value={profile.email}
              disabled
              style={{backgroundColor: '#f5f5f5', cursor: 'not-allowed'}}
            />
          </div>

          <div className="form-group-fashion mb-3">
            <label className="form-label-fashion">Profile Image</label>
            <input
              className="form-input-fashion"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {(imagePreview || profileImage) && (
              <div className="mt-2">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{
                    maxWidth: '150px', 
                    maxHeight: '150px', 
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                  }} 
                />
                <p style={{fontSize: '12px', color: '#666', marginTop: '4px'}}>
                  {profileImage ? profileImage.name : 'No file selected'}
                </p>
              </div>
            )}
          </div>

          <div className="form-actions-fashion">
            <button className="btn-save-fashion" type="button" onClick={handleSave}>
              <i className="bi bi-check-lg me-2"></i>
              Save Changes
            </button>
            <button type="button" className="btn-cancel-fashion" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountView
