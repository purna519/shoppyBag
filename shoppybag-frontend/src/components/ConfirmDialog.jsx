import React from 'react'
import '../styles/confirm-dialog.css'

export default function ConfirmDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger' // 'danger', 'warning', 'info'
}) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <div className="confirm-dialog-overlay" onClick={onClose}>
      <div className="confirm-dialog-container" onClick={(e) => e.stopPropagation()}>
        <div className={`confirm-dialog-icon ${variant}`}>
          {variant === 'danger' && <i className="bi bi-exclamation-triangle-fill"></i>}
          {variant === 'warning' && <i className="bi bi-exclamation-circle-fill"></i>}
          {variant === 'info' && <i className="bi bi-info-circle-fill"></i>}
        </div>
        
        <h3 className="confirm-dialog-title">{title}</h3>
        <p className="confirm-dialog-message">{message}</p>
        
        <div className="confirm-dialog-actions">
          <button 
            className="confirm-dialog-btn cancel"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-dialog-btn confirm ${variant}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
