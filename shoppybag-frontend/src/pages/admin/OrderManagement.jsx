import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/admin/order-management.css';
import '../../styles/admin/order-management-enhancements.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usersMap, setUsersMap] = useState({}); // Map userId to user

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch orders and users in parallel
      const [ordersRes, usersRes] = await Promise.all([
        axios.get('http://localhost:8080/api/orders/history', config),
        axios.get('http://localhost:8080/api/users/all', config)
      ]);

      const ordersData = ordersRes.data.data || [];
      const usersData = usersRes.data.data || [];

      // Create map of userId => user
      const userMap = {};
      usersData.forEach(user => {
        userMap[user.id] = user;
      });

      setOrders(ordersData);
      setUsersMap(userMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      console.log('Updating delivery status:', { orderId, newStatus });
      
      const response = await axios.put(
        `http://localhost:8080/api/orders/${orderId}/delivery-status`,
        { deliveryStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log('Update response:', response.data);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
      
      alert(`Delivery status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating delivery status:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to update delivery status: ' + (error.response?.data?.message || error.message));
    }
  };

  const viewOrderDetails = async (orderId) => {
    console.log('viewOrderDetails called with orderId:', orderId);
    try {
      const token = localStorage.getItem('authToken');
      console.log('Fetching order details for ID:', orderId);
      const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Order details response:', response.data);
      
      // Check if we got valid data
      if (response.data && response.data.data) {
        setSelectedOrder(response.data.data);
        setShowModal(true);
        console.log('Modal should now be visible');
      } else {
        console.error('No order data received:', response.data);
        alert(response.data?.message || 'Failed to load order details - No data received');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredOrders = filterStatus === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  if (loading) {
    return <div className="loading-spinner">Loading orders...</div>;
  }

  return (
    <div className="admin-page">
      <div className="page-header">
        <h1>Order Management</h1>
        <div className="filter-group">
          <label>Filter by Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="ALL">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="PAID">Paid</option>
            <option value="CONFIRMED_COD">Confirmed COD</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="table-container order-management-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Email</th>
              <th>Total Amount</th>
              <th>Payment Status</th>
              <th>Delivery Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{usersMap[order.userId]?.email || 'Unknown'}</td>
                  <td>₹{order.totalAmount}</td>
                  <td><span className={`status-badge ${order.status?.toLowerCase()}`}>{order.status}</span></td>
                  <td>
                    <select 
                      className="delivery-status-select"
                      value={order.deliveryStatus || 'PENDING'}
                      onChange={(e) => updateDeliveryStatus(order.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action btn-view"
                      onClick={() => {
                        console.log('View Details clicked for order:', order.id);
                        viewOrderDetails(order.id);
                      }}
                      title="View Details"
                      style={{ cursor: 'pointer', zIndex: 1, position: 'relative' }}
                    >
                      <i className="fas fa-eye"></i>
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{textAlign: 'center'}}>No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {showModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="info-row">
                <span className="label">Order ID</span>
                <span className="value">#{selectedOrder.id}</span>
              </div>

              <div className="info-row">
                <span className="label">Customer Email</span>
                <span className="value">{usersMap[selectedOrder.userId]?.email || 'Unknown'}</span>
              </div>

              <div className="info-row">
                <span className="label">Payment Status</span>
                <span className={`value status-badge ${selectedOrder.status?.toLowerCase()}`}>
                  {selectedOrder.status}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Delivery Status</span>
                <span className={`value status-badge delivery-${selectedOrder.deliveryStatus?.toLowerCase()}`}>
                  {selectedOrder.deliveryStatus || 'PENDING'}
                </span>
              </div>

              <div className="info-row">
                <span className="label">Total Amount</span>
                <span className="value">₹{selectedOrder.totalAmount}</span>
              </div>

              <div className="info-row">
                <span className="label">Order Date</span>
                <span className="value">
                  {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleString() : 'N/A'}
                </span>
              </div>

              {selectedOrder.orderItems && selectedOrder.orderItems.length > 0 && (
                <div className="info-row" style={{flexDirection: 'column', alignItems: 'flex-start', paddingTop: '1.5rem'}}>
                  <span className="label">Order Items ({selectedOrder.orderItems.length})</span>
                  <div style={{width: '100%', marginTop: '1rem'}}>
                    {selectedOrder.orderItems.map((item, index) => (
                      <div key={index} style={{
                        padding: '1rem',
                        background: '#f5f5f4',
                        borderRadius: '6px',
                        marginBottom: '0.75rem'
                      }}>
                        <p style={{margin: '0 0 0.5rem'}}><strong>Variant:</strong> {item.productVariant?.color} - {item.productVariant?.size}</p>
                        <p style={{margin: '0 0 0.5rem'}}><strong>SKU:</strong> {item.productVariant?.sku}</p>
                        <p style={{margin: '0 0 0.5rem'}}><strong>Quantity:</strong> {item.quantity}</p>
                        <p style={{margin: '0'}}><strong>Price:</strong> ₹{item.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
