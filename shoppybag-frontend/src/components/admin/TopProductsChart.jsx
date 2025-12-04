import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopProductsChart = ({ orders = [], products = [] }) => {
  const [period, setPeriod] = useState('all');
  const [metric, setMetric] = useState('quantity');

  const getFilteredOrders = () => {
    if (period === 'all') return orders;
    
    const now = new Date();
    const cutoffDate = new Date();
    
    switch(period) {
      case '7days':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30days':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90days':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return orders;
    }
    
    return orders.filter(order => new Date(order.orderDate) >= cutoffDate);
  };

  const getTopProducts = () => {
    const filteredOrders = getFilteredOrders();
    const productStats = {};

    // Aggregate product data from all order items
    filteredOrders.forEach(order => {
      if (order.orderItems && Array.isArray(order.orderItems)) {
        order.orderItems.forEach(item => {
          const productId = item.product?.id || item.productId;
          const productName = item.product?.name || `Product #${productId}`;
          
          if (!productStats[productId]) {
            productStats[productId] = {
              name: productName,
              quantity: 0,
              revenue: 0
            };
          }
          
          productStats[productId].quantity += item.quantity || 0;
          productStats[productId].revenue += (item.quantity || 0) * (item.price || 0);
        });
      }
    });

    // Convert to array and sort
    const sortedProducts = Object.values(productStats)
      .sort((a, b) => metric === 'quantity' ? b.quantity - a.quantity : b.revenue - a.revenue)
      .slice(0, 5); // Top 5 products

    return sortedProducts;
  };

  const topProducts = getTopProducts();

  const data = {
    labels: topProducts.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name),
    datasets: [
      {
        label: metric === 'quantity' ? 'Units Sold' : 'Revenue (₹)',
        data: topProducts.map(p => metric === 'quantity' ? p.quantity : p.revenue),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  };

  const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        backgroundColor: '#0a0a0a',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: (context) => {
            if (metric === 'quantity') {
              return `${context.parsed.x} units sold`;
            } else {
              return `₹${context.parsed.x.toLocaleString('en-IN')}`;
            }
          }
        }
      }
    },
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          color: '#737373',
          font: {
            size: 11
          },
          callback: (value) => metric === 'revenue' ? `₹${value}` : value
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#737373',
          font: {
            size: 11
          }
        }
      }
    }
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Top Selling Products</h3>
        <div className="chart-filters">
          <select className="chart-filter" value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value="quantity">By Quantity</option>
            <option value="revenue">By Revenue</option>
          </select>
          <select className="chart-filter" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default TopProductsChart;
