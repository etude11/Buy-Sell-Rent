import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/FormStyles';
import { Typography, Box, Button } from '@mui/material';
import { fetchPendingOrders, fetchBoughtItems, fetchSoldItems, completeOrder } from '../api/api';
import './Orders.css';  // You'll need to create this CSS file

const Orders = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [boughtItems, setBoughtItems] = useState([]);
  const [soldItems, setSoldItems] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const [pending, bought, sold] = await Promise.all([
          fetchPendingOrders(token),
          fetchBoughtItems(token),
          fetchSoldItems(token)
        ]);
        setPendingOrders(pending.data);
        setBoughtItems(bought.data);
        setSoldItems(sold.data);
        
        
        
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    loadOrders();
  }, [token]);

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId, token);
      window.location.reload();
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };

  const OrderCard = ({ order, showOtp = false }) => {
    const item = order.items?.[0]?.itemId;
    return (
        <div className="order-card">
            <h3>{item?.name || 'Unknown Item'}</h3>
            <p>Price: ₹{item?.price || 0}</p>
            <p>Status: {order.items?.[0]?.status || 'Unknown'}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            {showOtp && order.rawOtp && 
                <p className="otp">OTP: <span className="otp-badge">{order.rawOtp}</span></p>
            }
            {order.buyer && 
                <p>Buyer: {order.buyer?.firstName} {order.buyer?.lastName}</p>
            }
        </div>
    );
};

  return (
    <PageContainer>
      <Typography variant="h4" gutterBottom>Orders</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        <Button 
          variant={activeTab === 'pending' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </Button>
        <Button 
          variant={activeTab === 'bought' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('bought')}
        >
          Bought Items
        </Button>
        <Button 
          variant={activeTab === 'sold' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('sold')}
        >
          Sold Items
        </Button>
      </Box>
      <Box sx={{ width: '100%' }}>
        <div className="tab-content">
          {activeTab === 'pending' && (
            <div className="orders-grid">
              {pendingOrders.map(order => (
                <OrderCard key={order._id} order={order} showOtp={true} />
              ))}
            </div>
          )}

          {activeTab === 'bought' && (
            <div className="orders-grid">
              {boughtItems.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}

          {activeTab === 'sold' && (
            <div className="orders-grid">
              {soldItems.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </div>
      </Box>
    </PageContainer>
  );
};

export default Orders;
