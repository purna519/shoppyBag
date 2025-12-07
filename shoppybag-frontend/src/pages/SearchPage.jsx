import React, { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategoryNavbar from '../components/CategoryNavbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import api from '../api/api'
import '../styles/reviews.css'

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
      let res = await api.get('/api/product/fetchallProducts')
      
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

    if (category) {
      filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase())
    }

    if (brand) {
      filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase())
    }

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

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <CategoryNavbar />
      
      <main className="flex-grow-1">
        {/* Category Header Banner */}
        <div className="category-header-banner">
          <div className="container">
            <div className="category-header-content">
              <h1 className="category-title">{getTitle()}</h1>
              <p className="category-subtitle">
                {loading ? 'Loading...' : `Found ${filteredProducts.length} product(s)`}
              </p>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="section-products">
          <div className="container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner-border text-primary" role="status"></div>
                <div className="mt-3">Curating your perfect collection...</div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="empty-state">
                <i className="bi bi-bag-x"></i>
                <h4 className="mt-3">No products found</h4>
                <p className="text-muted">
                  {query ? 'Try searching with different keywords' : 'No products available in this category'}
                </p>
                <Link to="/" className="btn-fashion-primary mt-3">
                  Back to Home
                </Link>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-grid-item">
                    <ProductCard p={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
