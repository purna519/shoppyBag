import React from 'react'
import { Link } from 'react-router-dom'

export default function CategoryNavbar() {
  const categories = [
    "Men Clothing", "Women Clothing", "Footwear", "Watches",
    "Chains & Rings", "Bags & Wallets", "Cosmetics", "Accessories"
  ]

  const brands = {
    "Men Clothing": ["Levis", "Tommy Hilfiger", "Allen Solly", "Zodiac", "Roadster"],
    "Women Clothing": ["Biba", "Global Desi", "W", "Only", "Pantaloons"],
    "Footwear": ["Nike", "Adidas", "Skechers", "Bata", "Puma"],
    "Watches": ["Fossil", "Titan", "Casio", "Fastrack", "Timex"],
    "Chains & Rings": ["CaratLane", "Tanishq", "Voylla", "Bluestone", "Orra"],
    "Bags & Wallets": ["Wildcraft", "Hidesign", "Fossil", "Lavie", "Baggit"],
    "Cosmetics": ["Maybelline", "Lakme", "L'Oreal", "Nykaa", "Colorbar"],
    "Accessories": ["Ray-Ban", "Daniel Klein", "Urbanic", "Sukkhi", "Allurez"]
  }

  return (
    <div className="category-navbar border-bottom bg-white d-none d-lg-block">
      <div className="container">
        <ul className="nav justify-content-center">
          {categories.map((cat, idx) => (
            <li className="nav-item dropdown position-static" key={idx}>
              <Link 
                className="nav-link text-dark fw-medium py-3 px-3 dropdown-toggle-hover" 
                to={`/search?category=${encodeURIComponent(cat)}`}
              >
                {cat}
              </Link>
              {brands[cat] && (
                <div className="dropdown-menu shadow-lg border-0 mt-0" style={{minWidth: '200px'}}>
                  <div className="p-2">
                    <h6 className="dropdown-header text-uppercase fw-bold text-primary small">{cat} Brands</h6>
                    {brands[cat].map((brand, bIdx) => (
                      <Link 
                        key={bIdx} 
                        to={`/search?category=${encodeURIComponent(cat)}&brand=${encodeURIComponent(brand)}`}
                        className="dropdown-item rounded py-2"
                      >
                        {brand}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
