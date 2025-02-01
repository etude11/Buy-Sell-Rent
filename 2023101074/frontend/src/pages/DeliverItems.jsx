import React, { useState, useEffect } from 'react';
import { getSellerOrders, completeDelivery } from '../api/api';

const DeliverItems = () => {
  const [orders, setOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [error, setError] = useState({});
  const [success, setSuccess] = useState({});
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data } = await getSellerOrders(token);
      const pendingOrders = Array.isArray(data) ? data.filter(order => order.status === 'Pending') : [];
      setOrders(pendingOrders);
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 401) {
        // Handle unauthorized error - maybe redirect to login
        
      }
    }
  };

  const handleOtpChange = (orderId, value) => {
    setOtpInputs(prev => ({
      ...prev,
      [orderId]: value
    }));
  };

  const handleDeliveryComplete = async (orderId) => {
    try {
      const { data } = await completeDelivery(orderId, otpInputs[orderId],token);
      
      if (data.success) {
        setSuccess({ ...success, [orderId]: true });
        setError({ ...error, [orderId]: null });
        setOrders(orders.filter(order => order._id !== orderId));
      }
    } catch (err) {
      setError({ 
        ...error, 
        [orderId]: err.response?.data?.message || 'Invalid OTP. Please try again.' 
      });
      setSuccess({ ...success, [orderId]: false });
    }
  };
  

  return (
    <div>
      <h1>Pending Deliveries</h1>

      {orders.length === 0 ? (
        <p>No pending deliveries</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
              <h3>{order.item.name}</h3>
              <p>Price: ₹{order.item.price}</p>
              <p>Buyer: {order.buyer.name}</p>
              <p>Delivery OTP: {order.rawOtp}</p>
              
              <div>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otpInputs[order._id] || ''}
                  onChange={(e) => handleOtpChange(order._id, e.target.value)}
                />
                <button onClick={() => handleDeliveryComplete(order._id)}>
                  Complete Delivery
                </button>
              </div>

              {error[order._id] && (
                <p style={{ color: 'red' }}>{error[order._id]}</p>
              )}

              {success[order._id] && (
                <p style={{ color: 'green' }}>Delivery completed successfully!</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliverItems;
