import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-brand">
        <h2>ShoppyBag</h2>
        <p>Admin Panel</p>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-users"></i>
              <span>Users</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-box"></i>
              <span>Products</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-shopping-cart"></i>
              <span>Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/reviews" className={({ isActive }) => isActive ? 'active' : ''}>
              <i className="fas fa-star"></i>
              <span>Reviews</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
