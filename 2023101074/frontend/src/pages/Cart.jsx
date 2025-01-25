import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import {placeOrder} from "../api/api";
import AuthContext from '../context/AuthContext';

const CartPage = () => {
  const { cart, addToCart, decrementCartItem } = useContext(CartContext);
  const token = localStorage.getItem('token');
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && cart) {
      setLoading(false);
    }
  }, [user, cart]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (cart && cart.length === 0) {
    console.log(cart);
    return <p>Cart is empty</p>;
  }

  return (
    <div>
      <h1>Your Cart</h1>
      {cart.map(({ itemId, quantity }) => {
        if (!itemId) return null; // Prevents undefined errors

        return (
          <div key={itemId._id} className="cart-item">
            <h3>{itemId.name || "Unknown Item"}</h3>
            <p>₹{itemId.price || 0}</p>
            <div className="cart-controls">
              <button onClick={() => decrementCartItem(itemId._id)}>-</button>
              <span>{quantity}</span>
              <button onClick={() => addToCart(itemId._id)}>+</button>
            </div>
          </div>

        );
      })}
      <button onClick={() => placeOrder(cart, token, user._id)}>Place Order</button>

    </div>
  );
};

export default CartPage;
