import React, { useContext } from 'react'
import ToastContext from '../Context/ToastContext'

function ToastItem({t, onClose}){
  const cls = t.type === 'error' ? 'bg-danger text-white' : t.type === 'success' ? 'bg-success text-white' : 'bg-secondary text-white'
  return (
    <div className={`toast show ${cls}`} role="alert" aria-live="assertive" aria-atomic="true" style={{minWidth:240}}>
      <div className="toast-body">
        <div className="d-flex align-items-start">
          <div className="me-auto">{t.message}</div>
          <button className="btn-close btn-close-white ms-2" onClick={()=>onClose(t.id)} aria-label="Close"></button>
        </div>
      </div>
    </div>
  )
}

export default function ToastContainer(){
  const { toasts, removeToast } = useContext(ToastContext)
  if(!toasts || toasts.length === 0) return null
  return (
    <div style={{position:'fixed', top:16, right:16, zIndex:1060}}>
      <div className="d-flex flex-column gap-2">
        {toasts.map(t => <ToastItem key={t.id} t={t} onClose={removeToast} />)}
      </div>
    </div>
  )
}
