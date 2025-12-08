import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import StarRating from '../components/StarRating'
import ReviewList from '../components/ReviewList'
import ReviewForm from '../components/ReviewForm'
import api from '../api/api'
import CartContext from '../Context/CartContext'
import { ToastContext } from '../Context/ToastContext'
import '../styles/product-detail.css'
import '../styles/mini-cart.css'
import '../styles/reviews.css'

export default function ProductDetail(){
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [reviews, setReviews] = useState([])
  const [ratingStats, setRatingStats] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const { cart, addToCart } = useContext(CartContext)
  const { showToast } = useContext(ToastContext)
  const [mainIndex, setMainIndex] = useState(0)

  useEffect(()=>{
    loadProduct()
  },[id])

  const loadProduct = async () => {
    setLoading(true)
    try {
      const res = await api.get(`/api/product/${id}`)
      if(res?.data?.data){
        const p = res.data.data
        // Normalize backend data
        p.variants = (p.productVariants || []).map(v => ({
          ...v,
          name: `${v.color} / ${v.size}`,
          displayName: v.size,
          displayColor: v.color
        }))
        p.images = (p.productImage || []).map(img => img.imageUrl)
        
        setProduct(p)
        setSelectedVariant((p.variants && p.variants[0]) || null)
        
        // Load related products
        loadRelatedProducts(p.category)
      }
    } catch(err){
      console.error('Failed to fetch product', err)
    } finally {
      setLoading(false)
    }
  }

  const loadRelatedProducts = async (category) => {
    try {
      // Get all products and filter by same category
      const res = await api.get('/api/product/fetchallProducts')
      let products = []
      if (res?.data?.data && Array.isArray(res.data.data)) {
        products = res.data.data
      } else if (Array.isArray(res?.data)) {
        products = res.data
      }
      
      // Filter by same category, exclude current product, limit to 4
      const related = products
        .filter(p => p.category === category && p.id !== parseInt(id))
        .slice(0, 4)
      
      setRelatedProducts(related)
    } catch(err){
      console.error('Failed to load related products', err)
    }
  }

  const loadReviews = async () => {
    try {
      const res = await api.get(`/api/reviews/product/${id}`)
      setReviews(res.data || [])
    } catch (err) {
      console.error('Failed to load reviews', err)
    }
  }

  const loadRatingStats = async () => {
    try{
      const res = await api.get(`/api/reviews/product/${id}/stats`)
      setRatingStats(res.data)
    } catch (err) {
      console.error('Failed to load rating stats', err)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    setUserToken(token)
    if (id) {
      loadReviews()
      loadRatingStats()
    }
  }, [id])

  useEffect(()=>{ setMainIndex(0) }, [product])

  if(loading) return (
    <div><Navbar/><div className="container py-5 text-center"><div className="spinner-border text-primary" role="status"></div></div><Footer/></div>
  )
  
  if(!product) return (
    <div><Navbar/><div className="container py-5 text-center"><h3>Product not found</h3></div><Footer/></div>
  )

  const price = selectedVariant ? selectedVariant.price : (product.price || 0)
  const discount = product.discountPercentage || 0
  const discountedPrice = Math.round(price * (1 - discount/100))
  const stock = selectedVariant ? selectedVariant.stockQuantity : product.stockQuantity

  const handleAdd = async ()=>{
    try{
      await addToCart({ 
        productId: product.id, 
        variantId: selectedVariant?.id || null, 
        quantity, 
        price 
      })
      showToast('Added to cart!', 'success')
    }catch(e){ 
      showToast('Failed to add to cart', 'error') 
    }
  }

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN')}`
  }

  // Get unique sizes from variants
  const uniqueSizes = [...new Set((product.variants||[]).map(v => v.displayName))]

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="product-detail-container">
        <div className="product-detail-grid">
          {/* Left Column: Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              <img 
                src={product.images?.[mainIndex] || product.imageUrl || '/placeholder.png'} 
                alt={product.name}
              />
              {(product.images||[]).length > 1 && (
                <>
                  <button 
                    className="gallery-nav gallery-nav-prev" 
                    onClick={()=>setMainIndex(i => (i - 1 + product.images.length) % product.images.length)}
                  >
                    <i className="bi bi-chevron-left"></i>
                  </button>
                  <button 
                    className="gallery-nav gallery-nav-next" 
                    onClick={()=>setMainIndex(i => (i + 1) % product.images.length)}
                  >
                    <i className="bi bi-chevron-right"></i>
                  </button>
                </>
              )}
            </div>

            <div className="gallery-thumbs">
              {(product.images||[]).map((src, idx) => (
                <div 
                  key={idx} 
                  className={`gallery-thumb ${mainIndex===idx ? 'active' : ''}`}
                  onClick={()=>setMainIndex(idx)}
                >
                  <img src={src} alt={`thumb-${idx}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="product-info">
            <div className="product-brand">{product.brand}</div>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.category}</p>
            
            {/* Rating Display - Format: 4.0★ (3,451)Rating & (367)Reviews */}
            {ratingStats && ratingStats.averageRating > 0 && (
              <div className="product-rating-display">
                <span className="rating-value">{ratingStats.averageRating.toFixed(1)}</span>
                <span className="rating-star">★</span>
                <span className="rating-count">({ratingStats.ratingCount})Rating</span>
                <span className="rating-separator"> & </span>
                <span className="review-count">({ratingStats.reviewCount})Reviews</span>
              </div>
            )}

            {/* Price */}
            <div className="product-price-section">
              {discount > 0 ? (
                <>
                  <span className="price-current">{formatPrice(discountedPrice)}</span>
                  <span className="price-original">{formatPrice(price)}</span>
                  <span className="price-discount">-{discount}% OFF</span>
                </>
              ) : (
                <span className="price-current">{formatPrice(price)}</span>
              )}
            </div>

            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div className="product-options">
                <label className="option-label">Select Size</label>
                <div className="size-selector">
                  {uniqueSizes.map((size, idx) => {
                    const variant = product.variants.find(v => v.displayName === size)
                    return (
                      <button
                        key={idx}
                        className={`size-btn ${selectedVariant?.displayName === size ? 'active' : ''}`}
                        onClick={()=>setSelectedVariant(variant)}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="product-options">
              <label className="option-label">Quantity</label>
              <div className="quantity-selector">
                <button 
                  className="qty-btn" 
                  onClick={()=>setQuantity(q => Math.max(1, q-1))}
                  disabled={quantity <= 1}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={()=>setQuantity(q => Math.min(stock, q+1))}
                  disabled={quantity >= stock}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>

            {/* Stock Status */}
            {stock > 0 && stock < 20 && (
              <div className="stock-warning">
                <i className="bi bi-exclamation-circle"></i>
                Only {stock} left in stock!
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-actions">
              <button 
                className="btn-add-to-cart" 
                onClick={handleAdd}
                disabled={stock <= 0}
              >
                {stock > 0 ? (
                  <>
                    <i className="bi bi-bag-plus"></i>
                    Add to Cart
                  </>
                ) : (
                  'Out of Stock'
                )}
              </button>
              <button className="btn-wishlist">
                <i className="bi bi-heart"></i>
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature-item">
                <i className="bi bi-truck"></i>
                <span>Free Shipping</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-arrow-repeat"></i>
                <span>Easy Returns</span>
              </div>
              <div className="feature-item">
                <i className="bi bi-shield-check"></i>
                <span>Secure Payment</span>
              </div>
            </div>
          </div>

          {/* Right Column: Mini Cart Sidebar */}
          <div className="mini-cart-sidebar">
            <div className="mini-cart-header">
              <i className="bi bi-bag"></i>
              <h3>Your Cart</h3>
              <span className="cart-count">{cart?.items?.length || 0}</span>
            </div>

            {!cart || !cart.items || cart.items.length === 0 ? (
              <div className="mini-cart-empty">
                <i className="bi bi-cart-x"></i>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="mini-cart-items">
                  {cart.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="mini-cart-item">
                      <img src={item.variant?.imageUrl || item.product?.imageUrl} alt={item.product?.name} />
                      <div className="mini-item-details">
                        <div className="mini-item-name">{item.product?.name}</div>
                        <div className="mini-item-meta">
                          {item.variant?.size} × {item.quantity}
                        </div>
                        <div className="mini-item-price">{formatPrice(item.price * item.quantity)}</div>
                      </div>
                    </div>
                  ))}
                  {cart.items.length > 3 && (
                    <div className="mini-cart-more">
                      +{cart.items.length - 3} more item(s)
                    </div>
                  )}
                </div>

                <div className="mini-cart-total">
                  <span>Subtotal:</span>
                  <span>{formatPrice(cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0))}</span>
                </div>

                <div className="mini-cart-actions">
                  <Link to="/cart" className="mini-btn-cart">
                    <i className="bi bi-cart3"></i>
                    View Cart
                  </Link>
                  <Link to="/checkout" className="mini-btn-checkout">
                    <i className="bi bi-lightning"></i>
                    Checkout
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <div className="container">
            <div className="reviews-header">
              <h2 className="section-title">Customer Reviews</h2>
              {ratingStats && ratingStats.averageRating > 0 && (
                <div className="rating-summary">
                  <div className="rating-average">{ratingStats.averageRating.toFixed(1)}</div>
                  <div>
                    <StarRating rating={ratingStats.averageRating} size="1.2rem" />
                    <div className="text-muted small mt-1">
                      Based on {ratingStats.reviewCount} review{ratingStats.reviewCount !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-md-8">
                <ReviewList reviews={reviews} />
              </div>
              <div className="col-md-4">
                {userToken ? (
                  <div className="review-form-wrapper">
                    <ReviewForm 
                      productId={id} 
                      onReviewSubmitted={() => {
                        loadReviews()
                        loadRatingStats()
                      }} 
                    />
                  </div>
                ) : (
                  <div className="text-center p-4 bg-light rounded">
                    <i className="bi bi-person-circle" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
                    <p className="mt-3">Please <Link to="/login">login</Link> to write a review</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="related-products-section">
            <h2 className="section-title">You May Also Like</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relProduct => (
                <Link
                  key={relProduct.id}
                  to={`/product/${relProduct.id}`}
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    <img src={relProduct.productImage?.[0]?.imageUrl || relProduct.imageUrl || '/placeholder.png'} alt={relProduct.name} />
                  </div>
                  <div className="related-product-info">
                    <h3 className="related-product-name">{relProduct.name}</h3>
                    <p className="related-product-category">{relProduct.category}</p>
                    <div className="related-product-price">{formatPrice(relProduct.price)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
