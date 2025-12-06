import React from 'react'

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

export default AccountView
