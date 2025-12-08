import { useState, useEffect } from 'react';
import api from '../api/api';

export const useCheckout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);

  const loadAddresses = async () => {
    try {
      const res = await api.get('/api/address/my');
      if (res?.data?.data && Array.isArray(res.data.data)) {
        setAddresses(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedAddress(res.data.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load addresses', err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  return {
    addresses,
    selectedAddress,
    setSelectedAddress,
    paymentMethod,
    setPaymentMethod,
    loading,
    setLoading
  };
};
