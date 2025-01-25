import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const ItemCard = ({ item }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="item-card">
      <h3>{item.name}</h3>
      <p>Price: ₹{item.price}</p>
      <button onClick={() => addToCart(item._id)}>Add to Cart</button>
    </div>
  );
};

export default ItemCard;
