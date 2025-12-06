import React from 'react';

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-inner">
        <div className="stat-icon">
          <i className={`fas ${icon}`}></i>
        </div>
        <div className="stat-details">
          <h3>{title}</h3>
          <p className="stat-value">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
