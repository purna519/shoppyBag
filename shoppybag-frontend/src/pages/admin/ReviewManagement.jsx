import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../../components/StarRating';
import '../../styles/admin/product-management.css';
import '../../styles/admin/review-management.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending' or 'all'

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const endpoint = filter === 'pending' 
        ? 'http://localhost:8080/api/reviews/pending'
        : 'http://localhost:8080/api/product/fetchallProducts'; // We'll get all and filter
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (filter === 'pending') {
        setReviews(response.data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(`http://localhost:8080/api/reviews/${reviewId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review approved successfully!');
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Review deleted successfully!');
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading-spinner">Loading reviews...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Review Management</h1>
        <div className="header-actions">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              <i className="fas fa-clock"></i> Pending Reviews
              {filter === 'pending' && <span className="badge">{reviews.length}</span>}
            </button>
          </div>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-check-circle" style={{fontSize: '4rem', color: '#4ade80'}}></i>
          <h3>No Pending Reviews</h3>
          <p>All reviews have been moderated!</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>User</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td>{review.id}</td>
                  <td>
                    <div className="product-cell">
                      <strong>{review.productName}</strong>
                      <small>ID: {review.productId}</small>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <strong>{review.userName}</strong>
                      <small>ID: {review.userId}</small>
                    </div>
                  </td>
                  <td>
                    <StarRating rating={review.rating} size="0.9rem" />
                  </td>
                  <td>
                    <div className="comment-cell" title={review.comment}>
                      {review.comment.length > 50 
                        ? review.comment.substring(0, 50) + '...' 
                        : review.comment}
                    </div>
                  </td>
                  <td>{formatDate(review.createdAt)}</td>
                  <td>
                    <span className={`status-badge ${review.isApproved ? 'approved' : 'pending'}`}>
                      {review.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {!review.isApproved && (
                      <button
                        className="btn-action btn-approve"
                        onClick={() => handleApprove(review.id)}
                        title="Approve Review"
                      >
                        <i className="fas fa-check"></i>
                        Approve
                      </button>
                    )}
                    <button
                      className="btn-action btn-delete"
                      onClick={() => handleDelete(review.id)}
                      title="Delete Review"
                    >
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
