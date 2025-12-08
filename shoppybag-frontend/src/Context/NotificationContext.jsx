import React, { createContext, useContext, useState, useCallback } from 'react'
import '../styles/notification.css'

const NotificationContext = createContext()

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])

  const showNotification = useCallback((message, type = 'success', duration = 5000) => {
    const id = Date.now() + Math.random()
    const notification = { id, message, type, duration }
    
    setNotifications(prev => [...prev, notification])
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
    
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const showSuccess = useCallback((message, duration) => {
    return showNotification(message, 'success', duration)
  }, [showNotification])

  const showError = useCallback((message, duration) => {
    return showNotification(message, 'error', duration)
  }, [showNotification])

  const showInfo = useCallback((message, duration) => {
    return showNotification(message, 'info', duration)
  }, [showNotification])

  const showWarning = useCallback((message, duration) => {
    return showNotification(message, 'warning', duration)
  }, [showNotification])

  return (
    <NotificationContext.Provider value={{ showSuccess, showError, showInfo, showWarning, removeNotification }}>
      {children}
      <div className="notification-container">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function Notification({ id, message, type, onClose }) {
  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-x-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  }

  const titles = {
    success: 'Success!',
    error: 'Error!',
    warning: 'Warning!',
    info: 'Info'
  }

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-icon">
        <i className={`bi ${icons[type]}`}></i>
      </div>
      <div className="notification-content">
        <h4>{titles[type]}</h4>
        <p>{message}</p>
      </div>
      <button className="notification-close" onClick={onClose}>
        <i className="bi bi-x"></i>
      </button>
    </div>
  )
}
