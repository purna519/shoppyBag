// Refactored Dashboard with extracted components
import React, { useState, useEffect } from 'react';
import StatCard from '../../components/admin/StatCard';
import PaymentsTable from '../../components/admin/PaymentsTable';
import RevenueChart from '../../components/admin/RevenueChart';
import OrdersChart from '../../components/admin/OrdersChart';
import PaymentsChart from '../../components/admin/PaymentsChart';
import UsersChart from '../../components/admin/UsersChart';
import axios from 'axios';
import '../../styles/admin/charts.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:8080/api/users/all', config),
        axios.get('http://localhost:8080/api/product/fetchallProducts', config),
        axios.get('http://localhost:8080/api/orders/history', config)
      ]);

      const users = usersRes.data.data || [];
      const products = productsRes.data.data || [];
      const orders = ordersRes.data.data || [];

      const revenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      const payments = orders
        .filter(order => order.payment)
        .map(order => ({
          id: order.payment.id,
          orderId: order.id,
          amount: order.payment.amountPaid || order.totalAmount,
          paymentMethod: order.payment.paymentMethod,
          paymentStatus: order.payment.paymentStatus,
          createdAt: order.orderDate
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: revenue.toFixed(2)
      });

      setOrders(orders);
      setProducts(products);
      setRecentPayments(payments);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <StatCard title="Total Users" value={stats.totalUsers} icon="fa-users" />
        <StatCard title="Total Products" value={stats.totalProducts} icon="fa-box" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon="fa-shopping-cart" />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue}`} icon="fa-rupee-sign" />
      </div>

      <div className="charts-grid">
        <RevenueChart orders={orders} />
        <OrdersChart orders={orders} />
        <PaymentsChart orders={orders} />
        <UsersChart orders={orders} />
      </div>

      <div className="recent-orders">
        <h2>Recent Payments</h2>
        <PaymentsTable payments={recentPayments} />
      </div>
    </div>
  );
};

export default Dashboard;
