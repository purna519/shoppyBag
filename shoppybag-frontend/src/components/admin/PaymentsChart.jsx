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

const PaymentsChart = ({ orders = [] }) => {
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

  // Generate date labels
  const getDateLabels = () => {
    const days = [];
    const numDays = getPeriodDays();
    const interval = numDays > 90 ? Math.ceil(numDays / 12) : 1;
    
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

  // Count successful and failed payments by period
  const getPaymentData = () => {
    const numDays = getPeriodDays();
    const interval = numDays > 90 ? Math.ceil(numDays / 12) : 1;
    const successfulPayments = [];
    const failedPayments = [];
    
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

      const successful = periodOrders.filter(order => 
        order.payment?.paymentStatus === 'COMPLETED' || 
        order.payment?.paymentStatus === 'SUCCESS'
      ).length;

      const failed = periodOrders.filter(order => 
        order.payment?.paymentStatus === 'FAILED' || 
        order.payment?.paymentStatus === 'PENDING'
      ).length;

      successfulPayments.push(successful);
      failedPayments.push(failed);
    }
    
    return { successfulPayments, failedPayments };
  };

  const { successfulPayments, failedPayments } = getPaymentData();

  const data = {
    labels: getDateLabels(),
    datasets: [
      {
        label: 'Successful',
        data: successfulPayments,
        fill: true,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
      {
        label: 'Failed',
        data: failedPayments,
        fill: true,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        pointBackgroundColor: '#ef4444',
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
          label: (context) => `${context.dataset.label}: ${context.parsed.y} payments`
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
        <h3>Payment Trends</h3>
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

export default PaymentsChart;
