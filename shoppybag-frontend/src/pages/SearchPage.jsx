import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import CategoryNavbar from '../components/CategoryNavbar'
import Footer from '../components/Footer'
import api from '../api/api'
import ProductCard from '../components/ProductCard'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const category = searchParams.get('category')
  const brand = searchParams.get('brand')
  const query = searchParams.get('q')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // In a real app, you'd have a specific search endpoint. 
        // For now, we'll fetch all and filter client-side or use a hypothetical search endpoint if available.
        // Let's assume we fetch all and filter for this demo to ensure it works with current backend.
        const res = await api.get('/product/fetchallProducts')
        let allProds = []
        if(res?.data?.data && Array.isArray(res.data.data)) allProds = res.data.data
        else if(Array.isArray(res?.data)) allProds = res.data
        
        // Filter logic
        let filtered = allProds
        if (category) {
          filtered = filtered.filter(p => p.category?.toLowerCase() === category.toLowerCase())
        }
        if (brand) {
          filtered = filtered.filter(p => p.brand?.toLowerCase() === brand.toLowerCase())
        }
        if (query) {
          const q = query.toLowerCase()
          filtered = filtered.filter(p => 
            p.name?.toLowerCase().includes(q) || 
            p.description?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q)
          )
        }

        setProducts(filtered)
      } catch (err) {
        console.error('Search failed', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [category, brand, query])

  const getTitle = () => {
    if (brand) return `${brand} - ${category}`
    if (category) return category
    if (query) return `Results for "${query}"`
    return 'All Products'
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <CategoryNavbar />
      <main className="flex-grow-1 container py-5">
        <h3 className="fw-bold mb-4">{getTitle()}</h3>
        
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-5 bg-light rounded">
            <i className="bi bi-search fs-1 text-muted mb-3 d-block"></i>
            <p className="text-muted">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="row g-4">
            {products.map(p => (
              <div className="col-6 col-md-3" key={p.id}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
