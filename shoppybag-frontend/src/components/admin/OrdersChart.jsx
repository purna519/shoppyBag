import React, { useMemo } from 'react';
import '../../styles/admin/orders-chart.css';

const OrdersChart = ({ orders }) => {
  const statusCounts = useMemo(() => {
    const counts = {
      PENDING: 0,
      SHIPPED: 0,
      DELIVERED: 0,
      CANCELLED: 0
    };

    orders.forEach(order => {
      const status = order.deliveryStatus || 'PENDING';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });

    return counts;
  }, [orders]);

  const maxCount = Math.max(...Object.values(statusCounts), 1);
  const chartData = [
    { label: 'Pending', count: statusCounts.PENDING, color: '#f59e0b' },
    { label: 'Shipped', count: statusCounts.SHIPPED, color: '#3b82f6' },
    { label: 'Delivered', count: statusCounts.DELIVERED, color: '#10b981' },
    { label: 'Cancelled', count: statusCounts.CANCELLED, color: '#ef4444' }
  ];

  return (
    <div className="chart-container orders-chart-wrapper">
      <div className="chart-header">
        <h3>ORDERS BY STATUS</h3>
        <select className="time-filter">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      
      <div className="orders-bar-chart-container">
        <div className="chart-y-axis">
          {[...Array(6)].map((_, i) => {
            const value = Math.ceil((maxCount / 5) * (5 - i));
            return (
              <div key={i} className="y-axis-label">
                {value}
              </div>
            );
          })}
          <div className="y-axis-label">0</div>
        </div>
        
        <div className="chart-bars">
          {chartData.map((item, index) => {
            const heightPercent = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            
            return (
              <div key={index} className="bar-wrapper">
                <div className="bar-container">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${heightPercent}%`,
                      backgroundColor: item.color
                    }}
                  >
                    {item.count > 0 && (
                      <span className="bar-value">{item.count}</span>
                    )}
                  </div>
                </div>
                <div className="bar-label">{item.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrdersChart;
