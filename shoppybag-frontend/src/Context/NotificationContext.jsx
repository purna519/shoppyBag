import React, { createContext, useState, useCallback } from 'react';

export const NotificationContext = createContext();

let notificationId = 0;

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, description = '') => {
    const id = ++notificationId;
    
    // Check for duplicates
    const isDuplicate = notifications.some(
      n => n.message === message && n.type === type
    );
    
    if (isDuplicate) return;

    const notification = {
      id,
      type, // 'success', 'error', 'warning', 'info'
      message,
      description
    };

    setNotifications(prev => {
      // Keep max 3 notifications
      const updated = [...prev, notification];
      return updated.slice(-3);
    });

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [notifications]);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const showSuccess = useCallback((message, description) => {
    addNotification('success', message, description);
  }, [addNotification]);

  const showError = useCallback((message, description) => {
    addNotification('error', message, description);
  }, [addNotification]);

  const showWarning = useCallback((message, description) => {
    addNotification('warning', message, description);
  }, [addNotification]);

  const showInfo = useCallback((message, description) => {
    addNotification('info', message, description);
  }, [addNotification]);

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        showSuccess, 
        showError, 
        showWarning, 
        showInfo,
        removeNotification 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
