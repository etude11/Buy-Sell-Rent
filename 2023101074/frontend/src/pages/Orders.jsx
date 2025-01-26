import React, { useContext, useEffect, useState } from 'react';
import { fetchOrders } from '../api/api';
import AuthContext from '../context/AuthContext';
import './Orders.css';

function Orders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user) {
        const token = localStorage.getItem('token');
        console.log(user._id);
        const response = await fetchOrders(token, user._id);
        setOrders(response.data);
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <p>Please login to view your orders</p>;
  }

  return (
    <div className='orders-container'>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className='order-item'>
            <h3>Order ID: {order._id}</h3>
            <p>Amount: ₹{order.amount}</p>
            <p>Status: {order.status}</p>
            <div>
              {order.sellerorder.map(sellerOrder => (
                <div key={sellerOrder.sellerId._id}>
                  <h4>Seller: {sellerOrder.sellerId.firstName} {sellerOrder.sellerId.lastName}</h4>
                  {sellerOrder.items.map(item => (
                    <div key={item.itemId._id}>
                      <p>Item: {item.itemId.name}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Status: {item.status}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;