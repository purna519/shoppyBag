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

const OrdersChart = ({ orders = [] }) => {
  const [period, setPeriod] = useState('all');

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

  // Get order status counts
  const getOrderStatusCounts = () => {
    const filteredOrders = getFilteredOrders();
    const statuses = {
      'Pending': 0,
      'Processing': 0,
      'Shipped': 0,
      'Delivered': 0,
      'Cancelled': 0
    };

    filteredOrders.forEach(order => {
      const status = order.orderStatus || 'Pending';
      if (statuses.hasOwnProperty(status)) {
        statuses[status]++;
      }
    });

    return statuses;
  };

  const statusCounts = getOrderStatusCounts();

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Orders',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(234, 88, 12, 0.8)',   // Pending - Orange
          'rgba(59, 130, 246, 0.8)',  // Processing - Blue
          'rgba(168, 85, 247, 0.8)',  // Shipped - Purple
          'rgba(34, 197, 94, 0.8)',   // Delivered - Green
          'rgba(239, 68, 68, 0.8)'    // Cancelled - Red
        ],
        borderColor: [
          'rgba(234, 88, 12, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 2,
        borderRadius: 6
      }
    ]
  };

  const options = {
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
          label: (context) => `${context.parsed.y} orders`
        }
      }
    },
    scales: {
      y: {
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
          stepSize: 1
        }
      },
      x: {
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
        <h3>Orders by Status</h3>
        <select className="chart-filter" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default OrdersChart;
