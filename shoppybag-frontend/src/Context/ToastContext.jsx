import React, { createContext, useCallback, useState } from 'react'

export const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    const t = { id, message, type }
    setToasts(s => [t, ...s])
    setTimeout(()=> setToasts(s => s.filter(x => x.id !== id)), duration)
  }, [])

  const removeToast = useCallback((id) => setToasts(s => s.filter(x => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export default ToastContext
