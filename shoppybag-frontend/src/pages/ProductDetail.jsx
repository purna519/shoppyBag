import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../api/api'
import CartContext from '../Context/CartContext'
import { ToastContext } from '../Context/ToastContext'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const { addToCart } = useContext(CartContext)
  const { showToast } = useContext(ToastContext)

  // Carousel state
  const [mainIndex, setMainIndex] = useState(0)
  const [playing, setPlaying] = useState(false) // Default to false for better UX on detail page

  useEffect(()=>{
    setLoading(true)
    api.get(`/product/${id}`)
      .then(res=>{
        if(res?.data?.data){
          const p = res.data.data
          // Normalize backend data
          p.variants = (p.productVariants || []).map(v => ({
            ...v,
            name: `${v.color} / ${v.size}`,
            displayName: v.size, // Use size for display if color is separate
            displayColor: v.color
          }))
          p.images = (p.productImage || []).map(img => img.imageUrl)
          
          setProduct(p)
          setSelectedVariant((p.variants && p.variants[0]) || null)
        } else {
          setProduct(null)
        }
      })
      .catch(err=>{
        console.error('Failed to fetch product', err)
        setProduct(null)
      })
      .finally(()=>{
        setLoading(false)
      })
  },[id])

  useEffect(()=>{ setMainIndex(0) }, [product])

  if(loading) return (<div><Navbar/><div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div></div><Footer/></div>)
  if(!product) return (<div><Navbar/><div className="container py-5 text-center"><h3>Product not found</h3></div><Footer/></div>)

  const price = selectedVariant ? selectedVariant.price : (product.price || 0)
  const discount = product.discountPercentage || 0
  const discountedPrice = Math.round(price * (1 - discount/100))
  const stock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity

  const handleAdd = async ()=>{
    try{
      await addToCart({ productId: product.id, variantId: selectedVariant?.id || null, quantity: 1, price })
      showToast('Added to cart', 'success')
    }catch(e){ showToast('Failed to add', 'error') }
  }

  // Helper to get color code if valid
  const getColorStyle = (colorName) => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = colorName;
    return ctx.fillStyle === '#000000' && colorName !== 'black' ? null : colorName;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container py-5 flex-grow-1">
        <div className="row g-5">
          {/* Left Column: Gallery */}
          <div className="col-md-6">
            <div className="product-gallery-main shadow-sm">
              <img 
                src={product.images?.[mainIndex] || '/placeholder.png'} 
                alt={product.name}
              />
              {/* Navigation Arrows */}
              {(product.images||[]).length > 1 && (
                <>
                  <button className="btn btn-light rounded-circle position-absolute start-0 ms-3 shadow-sm" onClick={()=>setMainIndex(i => (i - 1 + product.images.length) % product.images.length)}>‹</button>
                  <button className="btn btn-light rounded-circle position-absolute end-0 me-3 shadow-sm" onClick={()=>setMainIndex(i => (i + 1) % product.images.length)}>›</button>
                </>
              )}
            </div>

            <div className="product-gallery-thumbs">
              {(product.images||[]).map((src, idx) => (
                <div 
                  key={idx} 
                  className={`product-gallery-thumb ${mainIndex===idx ? 'active' : ''}`}
                  onClick={()=>setMainIndex(idx)}
                >
                  <img src={src} alt={`thumb-${idx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="col-md-6">
            <div className="ps-md-4">
              <div className="text-uppercase text-muted fw-bold small mb-2">{product.brand}</div>
              <h1 className="display-6 fw-bold mb-3">{product.name}</h1>
              <div className="mb-4 text-muted">{product.description}</div>

              <div className="mb-4">
                {discount > 0 ? (
                  <div className="d-flex align-items-center gap-3">
                    <span className="display-6 fw-bold text-primary">₹{discountedPrice}</span>
                    <span className="text-muted text-decoration-line-through fs-4">₹{price}</span>
                    <span className="badge bg-danger rounded-pill px-3">SAVE {discount}%</span>
                  </div>
                ) : (
                  <div className="display-6 fw-bold text-primary">₹{price}</div>
                )}
              </div>

              {/* Variants */}
              {(product.variants||[]).length > 0 && (
                <div className="mb-4">
                  <label className="form-label fw-bold mb-2">Select Variant</label>
                  <div className="d-flex flex-wrap gap-2">
                    {product.variants.map(v => {
                      const colorStyle = getColorStyle(v.displayColor);
                      return (
                        <div 
                          key={v.id} 
                          className={`variant-selector-btn ${selectedVariant?.id === v.id ? 'active' : ''}`}
                          onClick={()=>setSelectedVariant(v)}
                        >
                          {colorStyle && (
                            <div className="color-swatch" style={{backgroundColor: colorStyle}}></div>
                          )}
                          <div className="fw-bold small">{v.name}</div>
                          <div className="small text-muted">₹{v.price}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="d-flex gap-3 mt-5">
                <button 
                  className="btn btn-primary btn-lg px-5 rounded-pill flex-grow-1" 
                  onClick={handleAdd}
                  disabled={stock <= 0}
                >
                  {stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="btn btn-outline-secondary btn-lg px-4 rounded-pill">
                  <i className="bi bi-heart"></i>
                </button>
              </div>
              
              <div className="mt-4 pt-4 border-top">
                <div className="d-flex gap-4 text-muted small">
                  <div><i className="bi bi-truck me-2"></i>Free Delivery</div>
                  <div><i className="bi bi-shield-check me-2"></i>1 Year Warranty</div>
                  <div><i className="bi bi-arrow-return-left me-2"></i>7 Days Return</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
