import React from 'react';

const DeleteConfirmModal = ({ item, itemType = "item", onConfirm, onCancel }) => {
  if (!item) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content delete-confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Confirm Delete</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="delete-warning-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          
          <p className="delete-message">
            Are you sure you want to delete this {itemType}?
          </p>
          
          <div className="delete-item-info">
            <div className="info-row">
              <span className="label">ID</span>
              <span className="value">#{item.id}</span>
            </div>
            <div className="info-row">
              <span className="label">Name</span>
              <span className="value">{item.name}</span>
            </div>
            {item.category && (
              <div className="info-row">
                <span className="label">Category</span>
                <span className="value">{item.category}</span>
              </div>
            )}
          </div>
          
          <p className="delete-warning">
            This action cannot be undone.
          </p>
          
          <div className="modal-actions">
            <button className="btn-danger" onClick={onConfirm}>
              <i className="fas fa-trash"></i>
              Delete {itemType}
            </button>
            <button className="btn-secondary" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
