import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNotification } from '../../hooks/useNotification';
import StarRating from '../../components/StarRating';
import ConfirmDialog from '../../components/ConfirmDialog';
import '../../styles/admin/product-management.css';
import '../../styles/admin/review-management.css';

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // 'pending' or 'all'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    fetchReviews();
  }, [filter]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const endpoint = filter === 'pending' 
        ? 'http://localhost:8080/api/reviews/pending'
        : 'http://localhost:8080/api/reviews/all';
      
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setReviews(response.data || []);
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
      showSuccess('Review approved successfully!');
      fetchReviews();
    } catch (error) {
      console.error('Error approving review:', error);
      showError('Failed to approve review', error.response?.data?.message || error.message);
    }
  };

  const handleDeleteClick = (reviewId) => {
    setReviewToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:8080/api/reviews/${reviewToDelete}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showSuccess('Review deleted successfully!');
      setReviewToDelete(null);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      showError('Failed to delete review', error.response?.data?.message || error.message);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setReviewToDelete(null);
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
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              <i className="fas fa-list"></i> All Reviews
              {filter === 'all' && <span className="badge">{reviews.length}</span>}
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
                <th>Review ID</th>
                <th>User ID</th>
                <th>Product ID</th>
                <th>User</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Comment</th>
                <th>Verified</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map(review => (
                <tr key={review.id}>
                  <td><span className="id-badge">{review.id}</span></td>
                  <td><span className="id-badge">{review.userId}</span></td>
                  <td><span className="id-badge">{review.productId}</span></td>
                  <td>
                    <div className="user-cell">
                      <strong>{review.userName}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="product-cell">
                      <strong>{review.productName}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="rating-cell">
                      <StarRating rating={review.rating} size="0.9rem" />
                      <span className="rating-number">({review.rating})</span>
                    </div>
                  </td>
                  <td>
                    <div className="comment-cell" title={review.comment}>
                      {review.comment.length > 50 
                        ? review.comment.substring(0, 50) + '...' 
                        : review.comment}
                    </div>
                  </td>
                  <td>
                    {review.isVerifiedPurchase ? (
                      <span className="verified-badge">
                        <i className="fas fa-check-circle"></i> Yes
                      </span>
                    ) : (
                      <span className="not-verified-badge">No</span>
                    )}
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
                      onClick={() => handleDeleteClick(review.id)}
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Review?"
        message="Are you sure you want to delete this review? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default ReviewManagement;
