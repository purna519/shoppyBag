import React from 'react'

export default function Footer(){
  return (
    <footer className="app-footer mt-auto">
      <div className="container py-4 d-flex justify-content-between align-items-center">
        <div className="small footer-text">© {new Date().getFullYear()} ShoppyBag. All rights reserved.</div>
        <div>
          <a className="footer-link me-3" href="#"><i className="bi bi-facebook"></i></a>
          <a className="footer-link me-3" href="#"><i className="bi bi-twitter"></i></a>
          <a className="footer-link me-3" href="#"><i className="bi bi-instagram"></i></a>
        </div>
      </div>
    </footer>
  )
}
