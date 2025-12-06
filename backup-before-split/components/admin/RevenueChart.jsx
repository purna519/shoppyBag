import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = ({ orders = [] }) => {
  const [period, setPeriod] = useState('7days');

  const getPeriodDays = () => {
    switch(period) {
      case '7days': return 7;
      case '30days': return 30;
      case '90days': return 90;
      case '1year': return 365;
      case 'all': return Math.max(365, orders.length > 0 ? 
        Math.ceil((new Date() - new Date(orders[orders.length - 1]?.orderDate)) / (1000 * 60 * 60 * 24)) : 365);
      default: return 7;
    }
  };

  // Generate data for selected period
  const getDateLabels = () => {
    const days = [];
    const numDays = getPeriodDays();
    const interval = numDays > 90 ? Math.ceil(numDays / 12) : 1; // Show max 12 labels for long periods
    
    for (let i = numDays - 1; i >= 0; i -= interval) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (numDays > 90) {
        days.push(date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }));
      } else if (numDays > 30) {
        days.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      } else {
        days.push(date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }));
      }
    }
    return days;
  };

  // Calculate revenue per day for selected period
  const getRevenueByPeriod = () => {
    const numDays = getPeriodDays();
    const interval = numDays > 90 ? Math.ceil(numDays / 12) : 1;
    const revenueData = [];
    
    for (let i = numDays - 1; i >= 0; i -= interval) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - i);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + interval);

      const periodRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= startDate && orderDate < endDate;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      revenueData.push(periodRevenue);
    }
    return revenueData;
  };

  const data = {
    labels: getDateLabels(),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: getRevenueByPeriod(),
        fill: true,
        borderColor: '#0a0a0a',
        backgroundColor: 'rgba(10, 10, 10, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#0a0a0a',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
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
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString('en-IN')}`
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
          callback: (value) => `₹${value}`
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
        <h3>Revenue Trend{period === '7days' ? ' (Last 7 Days)' : period === '30days' ? ' (Last 30 Days)' : period === '90days' ? ' (Last 90 Days)' : period === '1year' ? ' (Last Year)' : ' (All Time)'}</h3>
        <select className="chart-filter" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
