import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './styles/global.css'
import './styles/navbar.css'
import './styles/product.css'
import './styles/hero.css'
import './styles/cart.css'
import './styles/auth.css'
import './styles/theme.css'
import { ToastProvider } from './Context/ToastContext'
import { CartProvider } from './Context/CartContext'
import ToastContainer from './components/ToastContainer'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
          <ToastContainer />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
)
