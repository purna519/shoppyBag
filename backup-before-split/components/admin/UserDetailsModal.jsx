// Clean Centered User Details Modal
import React from 'react';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content user-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="info-row">
            <span className="label">User ID</span>
            <span className="value">#{user.id}</span>
          </div>

          <div className="info-row">
            <span className="label">Full Name</span>
            <span className="value">{user.fullname}</span>
          </div>

          <div className="info-row">
            <span className="label">Email Address</span>
            <span className="value">{user.email}</span>
          </div>

          <div className="info-row">
            <span className="label">Account Role</span>
            <span className={`value role-${user.role.toLowerCase()}`}>{user.role}</span>
          </div>

          <div className="info-row">
            <span className="label">Account Status</span>
            <span className="value status-active">Active</span>
          </div>

          <div className="info-row">
            <span className="label">Permissions</span>
            <span className="value">{user.role === 'ADMIN' ? 'Full Access' : 'Limited Access'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
