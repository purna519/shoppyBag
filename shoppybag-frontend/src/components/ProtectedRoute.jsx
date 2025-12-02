import React from 'react'
import { Navigate } from 'react-router-dom'

// Protected Route wrapper - redirects to login if not authenticated
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />
  }

  // Authenticated, render the children
  return children
}
