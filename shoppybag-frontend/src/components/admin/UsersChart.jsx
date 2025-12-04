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

const UsersChart = ({ orders = [] }) => {
  const [period, setPeriod] = useState('30days');

  const getPeriodDays = () => {
    switch(period) {
      case '7days': return 7;
      case '30days': return 30;
      case '90days': return 90;
      case '1year': return 365;
      default: return 30;
    }
  };

  // Generate date labels for the period
  const getDateLabels = () => {
    const labels = [];
    const numDays = getPeriodDays();
    const interval = numDays > 30 ? Math.ceil(numDays / 10) : numDays > 7 ? 3 : 1;
    
    for (let i = numDays - 1; i >= 0; i -= interval) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (numDays > 90) {
        labels.push(date.toLocaleDateString('en-IN', { month: 'short' }));
      } else {
        labels.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      }
    }
    return labels;
  };

  // Count new users (unique users who placed orders) per period
  const getNewUsersData = () => {
    const numDays = getPeriodDays();
    const interval = numDays > 30 ? Math.ceil(numDays / 10) : numDays > 7 ? 3 : 1;
    const newUsersPerPeriod = [];
    const seenUsers = new Set();
    
    for (let i = numDays - 1; i >= 0; i -= interval) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - i);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + interval);

      const periodOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate < endDate;
      });

      const uniqueUsers = new Set();
      periodOrders.forEach(order => {
        const userId = order.users?.id || order.userId;
        if (userId && !seenUsers.has(userId)) {
          uniqueUsers.add(userId);
          seenUsers.add(userId);
        }
      });

      newUsersPerPeriod.push(uniqueUsers.size);
    }
    
    return newUsersPerPeriod;
  };

  // Count active users (users who placed orders) per period
  const getActiveUsersData = () => {
    const numDays = getPeriodDays();
    const interval = numDays > 30 ? Math.ceil(numDays / 10) : numDays > 7 ? 3 : 1;
    const activeUsersPerPeriod = [];
    
    for (let i = numDays - 1; i >= 0; i -= interval) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - i);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + interval);

      const periodOrders = orders.filter(order => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= startDate && orderDate < endDate;
      });

      const uniqueUsers = new Set();
      periodOrders.forEach(order => {
        const userId = order.users?.id || order.userId;
        if (userId) {
          uniqueUsers.add(userId);
        }
      });

      activeUsersPerPeriod.push(uniqueUsers.size);
    }
    
    return activeUsersPerPeriod;
  };

  const data = {
    labels: getDateLabels(),
    datasets: [
      {
        label: 'Active Users',
        data: getActiveUsersData(),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 6
      },
      {
        label: 'New Users',
        data: getNewUsersData(),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
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
        display: true,
        position: 'top',
        align: 'end',
        labels: {
          color: '#0a0a0a',
          font: {
            size: 11
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15
        }
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
          label: (context) => `${context.dataset.label}: ${context.parsed.y} users`
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
        <h3>User Activity</h3>
        <select className="chart-filter" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
        </select>
      </div>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default UsersChart;
