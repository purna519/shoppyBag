import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const CategoryChart = ({ products = [] }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get all unique categories
  const getAllCategories = () => {
    const categories = new Set();
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      categories.add(category);
    });
    return ['all', ...Array.from(categories)];
  };

  // Get filtered products based on selected category
  const getFilteredProducts = () => {
    if (selectedCategory === 'all') return products;
    return products.filter(p => (p.category || 'Uncategorized') === selectedCategory);
  };

  // Get product counts by category
  const getCategoryCounts = () => {
    const filteredProducts = getFilteredProducts();
    const categories = {};
    
    if (selectedCategory === 'all') {
      // Show all categories
      products.forEach(product => {
        const category = product.category || 'Uncategorized';
        categories[category] = (categories[category] || 0) + 1;
      });
    } else {
      // Show only selected category
      categories[selectedCategory] = filteredProducts.length;
    }

    return categories;
  };

  const categoryCounts = getCategoryCounts();
  const categoryNames = Object.keys(categoryCounts);
  const categoryValues = Object.values(categoryCounts);

  // Generate colors for categories
  const colors = [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(34, 197, 94, 0.8)',    // Green
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(234, 179, 8, 0.8)',    // Yellow
    'rgba(239, 68, 68, 0.8)'     // Red
  ];

  const borderColors = [
    'rgba(99, 102, 241, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(251, 146, 60, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(59, 130, 246, 1)',
    'rgba(234, 179, 8, 1)',
    'rgba(239, 68, 68, 1)'
  ];

  const data = {
    labels: categoryNames,
    datasets: [
      {
        label: 'Products',
        data: categoryValues,
        backgroundColor: colors.slice(0, categoryNames.length),
        borderColor: borderColors.slice(0, categoryNames.length),
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#0a0a0a',
          font: {
            size: 12
          },
          padding: 15,
          usePointStyle: true,
          pointStyle: 'circle'
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
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  const allCategories = getAllCategories();

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>Products by Category</h3>
        <select 
          className="chart-filter" 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Products</option>
          {allCategories.filter(cat => cat !== 'all').map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="chart-wrapper">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryChart;
