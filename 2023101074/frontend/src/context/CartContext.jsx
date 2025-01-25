import { createContext, useState, useEffect, useContext } from "react";
import AuthContext from '../context/AuthContext';
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      fetchCart(user._id);
    }
  }, [user]);

  const fetchCart = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch cart");

      const data = await res.json();
      setCart(data || []); // Ensure cart is an array
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]); // Prevent undefined errors
    }
  };

  const addToCart = async (itemId) => {
    if (!user) return console.error("User not logged in");

    try {
      const res = await fetch(`http://localhost:5000/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id, itemId }),
      });

      if (!res.ok) throw new Error("Failed to add item");

      const updatedCart = await res.json();
      setCart(updatedCart);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const decrementCartItem = async (itemId) => {
    if (!user) return console.error("User not logged in");

    try {
      const res = await fetch(`http://localhost:5000/api/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id, itemId }),
      });

      if (!res.ok) throw new Error("Failed to remove item");

      const updatedCart = await res.json();
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, decrementCartItem }}>
      {children}
    </CartContext.Provider>
  );
};
