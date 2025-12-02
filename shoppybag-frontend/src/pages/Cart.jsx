import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import CartContext from '../Context/CartContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CartPage(){
  const { cart, loadCart, updateItemById, removeItemById } = useContext(CartContext)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(()=>{
    loadCart().finally(() => setLoading(false))
  }, [])

  // Show loading state
  if(loading) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 container py-5">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
            <div className="mt-3 text-muted">Loading your cart...</div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Show login prompt only if NOT logged in
  if(!token) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="flex-grow-1 container py-5">
          <div className="empty-cart-fashion">
            <div className="empty-cart-icon">
              <i className="bi bi-lock-fill"></i>
            </div>
            <h3 className="empty-cart-title">Sign In Required</h3>
            <p className="empty-cart-text">Please sign in to view your shopping cart</p>
            <Link to="/login" className="btn-fashion-primary">
              Sign In
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1 cart-page-fashion">
        <div className="container py-5">
          
          {/* Page Header */}
          <div className="cart-header-fashion">
            <h2 className="cart-title-fashion">Shopping Cart</h2>
            <p className="cart-subtitle-fashion">
              {cart?.items?.length > 0 ? `${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'} in your cart` : 'Your cart is currently empty'}
            </p>
          </div>

          {/* Empty Cart State */}
          {(!cart || !cart.items || cart.items.length === 0) ? (
            <div className="empty-cart-fashion">
              <div className="empty-cart-icon">
                <i className="bi bi-bag-x"></i>
              </div>
              <h3 className="empty-cart-title">Your Cart is Empty</h3>
              <p className="empty-cart-text">Looks like you haven't added anything yet. Start shopping!</p>
              <Link to="/" className="btn-fashion-primary">
                Explore Collection
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          ) : (
            /* Cart Items */
            <div className="row g-4">
              {/* Left: Cart Items */}
              <div className="col-lg-8">
                <div className="cart-items-wrapper-fashion">
                  {cart.items.map(it=> {
                    if(!it.product) return null
                    return (
                      <div className="cart-item-fashion" key={it.id}>
                        <div className="cart-item-image-wrapper">
                          <img 
                            src={it.product.productImage?.[0]?.imageUrl || '/placeholder.png'} 
                            alt={it.product.name}
                            className="cart-item-image-fashion"
                          />
                        </div>
                        
                        <div className="cart-item-info-fashion">
                          <h6 className="cart-item-name-fashion">{it.product.name}</h6>
                          <div className="cart-item-meta">
                            {it.variant && (
                              <span className="cart-item-variant">
                                {it.variant.color} • {it.variant.size}
                              </span>
                            )}
                          </div>
                          <div className="cart-item-price-mobile">₹{(it.price * it.quantity).toFixed(2)}</div>
                        </div>
                        
                        <div className="cart-item-actions-fashion">
                          <div className="quantity-control-fashion">
                            <button 
                              className="qty-btn-fashion" 
                              onClick={()=>updateItemById(it.id, it.quantity-1)}
                              disabled={it.quantity <= 1}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="qty-value-fashion">{it.quantity}</span>
                            <button 
                              className="qty-btn-fashion" 
                              onClick={()=>updateItemById(it.id, it.quantity+1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          
                          <div className="cart-item-price-fashion">
                            ₹{(it.price * it.quantity).toFixed(2)}
                          </div>
                          
                          <button 
                            className="cart-item-remove-fashion" 
                            onClick={()=>removeItemById(it.id)}
                            title="Remove item"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="col-lg-4">
                <div className="cart-summary-fashion">
                  <h5 className="summary-title-fashion">Order Summary</h5>
                  
                  <div className="summary-row">
                    <span>Subtotal ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})</span>
                    <span>₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className="text-success fw-bold">FREE</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-total">
                    <span>Total</span>
                    <span>₹{cart.totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <Link to="/checkout" className="checkout-btn-fashion">
                    Proceed to Checkout
                    <i className="bi bi-arrow-right ms-2"></i>
                  </Link>
                  
                  <div className="secure-checkout-badge">
                    <i className="bi bi-shield-check me-2"></i>
                    Secure Checkout
                  </div>

                  <div className="benefits-list-fashion">
                    <div className="benefit-item">
                      <i className="bi bi-truck"></i>
                      <span>Free shipping on all orders</span>
                    </div>
                    <div className="benefit-item">
                      <i className="bi bi-arrow-repeat"></i>
                      <span>Easy 7-day returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
