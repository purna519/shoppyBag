import api from '../api/api';

export const handleCODPayment = async (orderId, token, navigate, setLoading) => {
  try {
    const base = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
    console.log('Initiating COD payment for order:', orderId);
    
    const res = await fetch(`${base}/payment/initiate/${orderId}?method=COD`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    if (data.status === 'Success' || data.status === 'success') {
      navigate('/payment-success', { state: { orderId, method: 'COD' } });
    } else {
      throw new Error(data.message || 'COD confirmation failed');
    }
  } catch (err) {
    console.error('COD error:', err);
    setLoading(false);
    alert('COD order failed: ' + err.message);
  }
};

export const handlePlaceOrder = async (cart, selectedAddress, paymentMethod, setLoading, setOrderDetails, setShowPaymentModal, navigate, calculateTotal) => {
  if (!selectedAddress) {
    alert('Please select a delivery address');
    return;
  }

  if (!cart?.items?.length) {
    alert('Your cart is empty');
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return navigate('/login');
    }

    const placeRes = await api.post('/api/orders/place');
    const orderId = placeRes.data?.data?.id;

    if (!orderId) {
      throw new Error('No orderId returned from server');
    }

    if (paymentMethod === 'COD') {
      await handleCODPayment(orderId, token, navigate, setLoading);
    } else {
      setOrderDetails({ orderId, amount: calculateTotal() });
      setShowPaymentModal(true);
      setLoading(false);
    }
  } catch (err) {
    console.error('Order error:', err);
    alert(`Order failed: ${err.message}`);
    setLoading(false);
  }
};
