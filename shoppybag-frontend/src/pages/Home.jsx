import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategoryNavbar from '../components/CategoryNavbar'
import Footer from '../components/Footer'
import api from '../api/api'
import ProductCard from '../components/ProductCard'

export default function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    setLoading(true)
    api.get('/product/fetchallProducts')
      .then(res=>{ 
        let prodList = []
        if(res?.data?.data && Array.isArray(res.data.data)) {
          prodList = res.data.data
        } else if(Array.isArray(res?.data)) {
          prodList = res.data
        }
        setProducts(prodList.slice(0, 40) || []) 
      })
      .catch(err=>{ 
        console.error('Failed to fetch products', err)
        setProducts([]) 
      })
      .finally(()=>setLoading(false))
  },[])

  const categories = [
    { name: 'Men Clothing', icon: 'bi-person', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { name: 'Women Clothing', icon: 'bi-gender-female', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { name: 'Footwear', icon: 'bi-shop', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { name: 'Watches', icon: 'bi-watch', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { name: 'Jewelry', icon: 'bi-gem', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
    { name: 'Bags', icon: 'bi-handbag', gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
    { name: 'Cosmetics', icon: 'bi-stars', gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
    { name: 'Accessories', icon: 'bi-sunglasses', gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }
  ]

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <CategoryNavbar />
      <main className="flex-grow-1">
        
        {/* Premium Fashion Hero */}
        <div className="fashion-hero">
          <div className="hero-overlay"></div>
          <div className="container position-relative">
            <div className="row align-items-center min-vh-75">
              <div className="col-lg-6">
                <div className="hero-content">
                  <span className="hero-badge">New Season Collection</span>
                  <h1 className="hero-headline">
                    Elevate Your
                    <span className="hero-highlight"> Style</span>
                  </h1>
                  <p className="hero-description">
                    Discover curated fashion pieces that define elegance and sophistication. 
                    Shop exclusive collections crafted for the modern trendsetter.
                  </p>
                  <div className="hero-actions">
                    <Link to="/search" className="btn-fashion-primary">
                      Explore Collection
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <button className="btn-fashion-outline">
                      <i className="bi bi-play-circle me-2"></i>
                      Watch Video
                    </button>
                  </div>
                  <div className="hero-stats">
                    <div className="stat-item">
                      <div className="stat-value">500+</div>
                      <div className="stat-label">Premium Brands</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <div className="stat-value">50k+</div>
                      <div className="stat-label">Happy Customers</div>
                    </div>
                    <div className="stat-divider"></div>
                    <div className="stat-item">
                      <div className="stat-value">4.9★</div>
                      <div className="stat-label">Average Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shop by Category - Elegant Cards */}
        <div className="section-categories">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Shop By Category</h2>
              <p className="section-subtitle">Find your perfect style in our curated collections</p>
            </div>
            
            <div className="row g-4">
              {categories.map((cat, idx) => (
                <div className="col-lg-3 col-md-4 col-sm-6" key={idx}>
                  <Link to={`/search?category=${encodeURIComponent(cat.name)}`} className="luxury-category-card">
                    <div className="category-card-inner" style={{ background: cat.gradient }}>
                      <div className="category-icon-wrapper">
                        <i className={`bi ${cat.icon}`}></i>
                      </div>
                      <h5 className="category-name">{cat.name}</h5>
                      <div className="category-arrow">
                        <i className="bi bi-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Now Banner */}
        <div className="trending-banner">
          <div className="container">
            <div className="trending-content">
              <div className="trending-text">
                <span className="trending-tag">🔥 TRENDING NOW</span>
                <h3>Summer Collection Sale - Up to 70% Off</h3>
                <p>Limited time offer on selected items</p>
              </div>
              <Link to="/search" className="btn-trending">
                Shop Sale
                <i className="bi bi-bag-heart ms-2"></i>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Products - Premium Grid */}
        <div className="section-products">
          <div className="container">
            <div className="section-header text-center">
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Handpicked items just for you</p>
            </div>
            
            {loading ? (
              <div className="loading-state">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-3">Curating your perfect collection...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-bag-x"></i>
                <p>No products available at the moment</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(p => (
                  <div key={p.id} className="product-grid-item">
                    <ProductCard p={p} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trust Badges - Luxury Style */}
        <div className="luxury-features">
          <div className="container">
            <div className="row g-4">
              <div className="col-md-3">
                <div className="feature-luxury-item">
                  <div className="feature-icon-luxury">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <h6>Authentic Products</h6>
                  <p>100% genuine brands</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="feature-luxury-item">
                  <div className="feature-icon-luxury">
                    <i className="bi bi-truck"></i>
                  </div>
                  <h6>Express Delivery</h6>
                  <p>Free shipping over ₹499</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="feature-luxury-item">
                  <div className="feature-icon-luxury">
                    <i className="bi bi-arrow-repeat"></i>
                  </div>
                  <h6>Easy Returns</h6>
                  <p>Hassle-free 7-day returns</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="feature-luxury-item">
                  <div className="feature-icon-luxury">
                    <i className="bi bi-headset"></i>
                  </div>
                  <h6>24/7 Support</h6>
                  <p>Expert assistance anytime</p>
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
