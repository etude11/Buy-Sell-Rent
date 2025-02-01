import React, { useState, useEffect } from 'react';
// import { AuthContext } from '../context/AuthContext';
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
    <div className="orders-container">
      <h2>Orders</h2>
      
      <div className="tabs">
        <button 
          className={activeTab === 'pending' ? 'active' : ''} 
          onClick={() => setActiveTab('pending')}
        >
          Pending Orders
        </button>
        <button 
          className={activeTab === 'bought' ? 'active' : ''} 
          onClick={() => setActiveTab('bought')}
        >
          Bought Items
        </button>
        <button 
          className={activeTab === 'sold' ? 'active' : ''} 
          onClick={() => setActiveTab('sold')}
        >
          Sold Items
        </button>
      </div>

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
    </div>
  );
};

export default Orders;
