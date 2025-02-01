import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { placeOrder } from "../api/api";
import AuthContext from '../context/AuthContext';

const CartPage = () => {
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const token = localStorage.getItem('token');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && cart) {
      setLoading(false);
    }
  }, [user, cart]);

  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
    window.location.reload();
  };

  const handlePlaceOrder = async () => {
    await placeOrder(cart, token, user._id);
    window.location.reload();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (cart && cart.length === 0) {
    return <p>Cart is empty</p>;
  }
  
  return (
    <div>
      <h1>Your Cart</h1>
      {cart.map((cartEntry) => {
        if (!cartEntry.item) return null;
        const currItem = cartEntry.item;
        return (
          <div key={currItem._id} className="cart-item">
            <h3>{currItem.name}</h3>
            <p>₹{currItem.price}</p>
            <button onClick={() => handleRemoveFromCart(currItem._id)}>Remove</button>
          </div>
        );
      })}
      <button onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default CartPage;
