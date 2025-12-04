// Custom hook for admin API calls
import { useState } from 'axios';
import axios from 'axios';

export const useAdminAPI = () => {
  const getAuthConfig = () => {
    const token = localStorage.getItem('authToken');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    const response = await axios.get('http://localhost:8080/api/users/all', getAuthConfig());
    return response.data.data || [];
  };

  const fetchOrders = async () => {
    const response = await axios.get('http://localhost:8080/api/orders/history', getAuthConfig());
    return response.data.data || [];
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:8080/api/product/fetchallProducts', getAuthConfig());
    return response.data.data || [];
  };

  const updateUserRole = async (email, role) => {
    const response = await axios.put(
      'http://localhost:8080/api/users/update',
      { email, role },
      getAuthConfig()
    );
    return response.data;
  };

  const deleteUser = async (email) => {
    const response = await axios.delete(
      'http://localhost:8080/api/users/delete',
      {
        ...getAuthConfig(),
        data: { email }
      }
    );
    return response.data;
  };

  return {
    fetchUsers,
    fetchOrders,
    fetchProducts,
    updateUserRole,
    deleteUser,
  };
};
