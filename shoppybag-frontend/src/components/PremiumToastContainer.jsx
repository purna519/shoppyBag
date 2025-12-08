import React, { useContext } from 'react';
import { ToastContext } from '../Context/ToastContext';
import '../styles/premium-toast.css';

const PremiumToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  const getIcon = (type) => {
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };
    return icons[type] || icons.info;
  };

  const getTitle = (type, customTitle) => {
    if (customTitle) return customTitle;
    const titles = {
      success: 'Success!',
      error: 'Error',
      warning: 'Warning',
      info: 'Info'
    };
    return titles[type] || 'Notification';
  };

  return (
    <div className="premium-toast-wrapper">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`premium-toast premium-toast-${toast.type} premium-toast-enter`}
        >
          <div className="premium-toast-icon">
            <i className={`bi ${getIcon(toast.type)}`}></i>
          </div>
          
          <div className="premium-toast-content">
            <div className="premium-toast-header">
              {getTitle(toast.type, toast.title)}
            </div>
            <div className="premium-toast-message">{toast.message}</div>
            {toast.description && (
              <div className="premium-toast-description">{toast.description}</div>
            )}
          </div>

          <button
            className="premium-toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            <i className="bi bi-x"></i>
          </button>

          <div className="premium-toast-progress"></div>
        </div>
      ))}
    </div>
  );
};

export default PremiumToastContainer;
