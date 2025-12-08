import { useState, useEffect } from 'react';
import api from '../api/api';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [ordersRes, usersRes] = await Promise.all([
        api.get('http://localhost:8080/api/orders/history', config),
        api.get('http://localhost:8080/api/users/all', config)
      ]);

      const ordersData = ordersRes.data.data || [];
      const usersData = usersRes.data.data || [];

      // Create user map
      const userMap = {};
      usersData.forEach(user => {
        userMap[user.id] = user;
      });

      setOrders(ordersData);
      setUsers(userMap);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('authToken');
      await api.put(
        `http://localhost:8080/api/orders/${orderId}/delivery-status`,
        { deliveryStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, deliveryStatus: newStatus } : order
      ));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating delivery status:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    users,
    loading,
    updateDeliveryStatus,
    refreshOrders: fetchOrders
  };
};
