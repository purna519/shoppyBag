import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartContext from '../Context/CartContext'

export default function Navbar(){
  const { cart, count, loadCart } = useContext(CartContext)
  const navigate = useNavigate()
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const onStorage = ()=> setToken(localStorage.getItem('token'))
    window.addEventListener('storage', onStorage)
    return ()=> window.removeEventListener('storage', onStorage)
  }, [])

  useEffect(() => {
    if (token) {
      fetch('http://localhost:8080/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(err => console.error(err))
    } else {
      setUser(null)
    }
  }, [token])

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(()=>{
    document.body.classList.toggle('dark-mode', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/')
  }

  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <nav className="navbar navbar-expand-lg app-navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">ShoppyBag</Link>
        
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          {/* Search Bar */}
          <form className="search-form mx-lg-auto my-3 my-lg-0" role="search" onSubmit={handleSearch}>
            <input 
              className="form-control search-input" 
              type="search" 
              placeholder="Search for products, brands and more..." 
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-btn" type="submit"><i className="bi bi-search"></i></button>
          </form>

          <ul className="navbar-nav ms-auto align-items-center gap-2">
            
            {/* Theme Toggle Switch */}
            <li className="nav-item">
              <label className="theme-toggle-wrapper" title="Toggle theme">
                <input 
                  type="checkbox" 
                  className="theme-toggle-input"
                  checked={theme === 'dark'}
                  onChange={()=>setTheme(t=> t==='light' ? 'dark' : 'light')}
                />
                <span className="theme-toggle-slider"></span>
              </label>
            </li>

            {/* Cart */}
            <li className="nav-item">
              <Link to="/cart" className="nav-icon-btn position-relative" onClick={()=>{ if(!cart) loadCart() }}>
                <i className="bi bi-bag" style={{fontSize: '1.2rem'}}></i>
                {count ? (<span className="badge bg-danger rounded-pill position-absolute" style={{top: '4px', right: '4px', fontSize: '0.6rem', padding: '0.25em 0.4em'}}>{count}</span>) : null}
              </Link>
            </li>

            {/* User Profile / Login */}
            {token ? (
              <li className="nav-item dropdown">
                <Link to="/profile?view=orders" className="nav-icon-btn" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-person-circle" style={{fontSize: '1.2rem'}}></i>
                </Link>
                <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2" style={{borderRadius: '12px', marginTop: '10px'}}>
                  <li><Link className="dropdown-item rounded px-3 py-2" to="/profile"><i className="bi bi-person me-2"></i>Account Details</Link></li>
                  <li><Link className="dropdown-item rounded px-3 py-2" to="/profile?view=addresses"><i className="bi bi-geo-alt me-2"></i>Addresses</Link></li>
                  <li><Link className="dropdown-item rounded px-3 py-2" to="/profile?view=orders"><i className="bi bi-bag-check me-2"></i>My Orders</Link></li>
                  <li><hr className="dropdown-divider"/></li>
                  <li><button className="dropdown-item rounded px-3 py-2 text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </li>
            ) : (
              <li className="nav-item ms-2">
                <Link to="/login" className="btn btn-primary rounded-pill px-4 fw-bold">Login</Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
  )
}
