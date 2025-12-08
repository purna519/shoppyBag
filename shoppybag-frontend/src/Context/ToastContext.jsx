import React, { createContext, useCallback, useState } from 'react';

export const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const duration = options.duration || 5000;
    
    const toast = {
      id,
      message,
      type, // 'success', 'error', 'warning', 'info'
      description: options.description || '',
      icon: options.icon || null,
      title: options.title || null
    };
    
    // Use functional update to check current state for duplicates
    setToasts(prev => {
      // Check for duplicates in current state
      const isDuplicate = prev.some(t => t.message === message && t.type === type);
      if (isDuplicate) return prev;
      
      // Keep max 3 toasts
      const updated = [...prev, toast];
      return updated.slice(-3);
    });
    
    setTimeout(() => setToasts(s => s.filter(x => x.id !== id)), duration);
  }, []); // Remove toasts from dependencies

  const removeToast = useCallback((id) => setToasts(s => s.filter(x => x.id !== id)), []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export default ToastContext;
