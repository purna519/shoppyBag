import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategoryNavbar from '../components/CategoryNavbar'
import Footer from '../components/Footer'
import api from '../api/api'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const query = searchParams.get('q')

  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllProducts()
  }, [])

  useEffect(() => {
    if (allProducts.length > 0) {
      filterProducts()
    }
  }, [category, brand, query, allProducts])

  const loadAllProducts = async () => {
    try {
      setLoading(true)
      // Try to fetch from /products/all, fallback to /product/fetchallProducts
      let res = await api.get('/products/all').catch(() => api.get('/product/fetchallProducts'))
      
      let products = []
      if (res?.data?.data && Array.isArray(res.data.data)) {
        products = res.data.data
      } else if (Array.isArray(res?.data)) {
        products = res.data
      }
      
      setAllProducts(products)
    } catch (err) {
      console.error('Failed to load products:', err)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = [...allProducts]

    // Filter by category
    if (category) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    }

    // Filter by brand
    if (brand) {
      filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase())
    }

    // Filter by search query
    if (query) {
      const lowerQuery = query.toLowerCase()
      filtered = filtered.filter(product => {
        const name = product.name?.toLowerCase() || ''
        const description = product.description?.toLowerCase() || ''
        const brandName = product.brand?.toLowerCase() || ''
        
        return name.includes(lowerQuery) || 
               description.includes(lowerQuery) || 
               brandName.includes(lowerQuery)
      })
    }

    setFilteredProducts(filtered)
  }

  const getTitle = () => {
    if (brand && category) return `${brand} - ${category}`
    if (brand) return brand
    if (category) return category
    if (query) return `Search results for "${query}"`
    return 'All Products'
  }

  const formatPrice = (price) => {
    return `₹${price?.toLocaleString('en-IN')}`
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <CategoryNavbar />
      <main className="flex-grow-1 container py-5">
        <h3 className="fw-bold mb-4">{getTitle()}</h3>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-5 bg-light rounded p-5">
            <i className="bi bi-search" style={{fontSize: '4rem', color: '#cbd5e1'}}></i>
            <h4 className="mt-3">No products found</h4>
            <p className="text-muted">
              {query ? 'Try searching with different keywords' : 'No products available in this category'}
            </p>
            <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
          </div>
        ) : (
          <>
            <p className="text-muted mb-4">Found {filteredProducts.length} product(s)</p>
            <div className="row g-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <Link 
                    to={`/product/${product.id}`} 
                    className="card product-card h-100 text-decoration-none"
                    style={{border: '1px solid #e2e8f0', borderRadius: '12px', transition: 'all 0.3s ease'}}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div className="position-relative" style={{paddingTop: '100%', overflow: 'hidden', borderRadius: '12px 12px 0 0'}}>
                      <img 
                        src={product.imageUrl || '/placeholder.jpg'} 
                        alt={product.name}
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{objectFit: 'cover'}}
                      />
                    </div>
                    <div className="card-body">
                      <h6 className="card-title mb-2" style={{
                        fontSize: '0.9rem', 
                        fontWeight: '700',
                        color: '#1e293b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.name}
                      </h6>
                      <p className="card-text mb-2" style={{
                        fontSize: '0.8rem',
                        color: '#64748b',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.category}
                      </p>
                      <div className="d-flex align-items-center justify-content-between">
                        <span style={{
                          fontSize: '1.1rem',
                          fontWeight: '800',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
