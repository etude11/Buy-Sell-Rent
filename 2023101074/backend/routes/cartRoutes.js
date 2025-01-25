import express from "express";
const router = express.Router();
import User from "../models/User.js";
// import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

// Get user's cart
router.get("/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("cart.itemId");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.cart || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Add item to cart
router.post("/add", protect, async (req, res) => {
//  console.log("add to cart");
  const { userId, itemId } = req.body;
  // console.log(userId);
  //   console.log(itemId);

  if (!userId || !itemId) {
    return res.status(400).json({ message: "User ID and Item ID are required" });
  }

  try {
    // console.log("add to cart");
    const user = await User.findOne({ _id: userId })

    // console.log(user);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Check if the item is already in the cart
    const existingItem = user.cart.find((cartItem) => cartItem.itemId.toString() === itemId);
    if (existingItem) {
      existingItem.quantity += 1; // Increment quantity
    } else {
      user.cart.push({ itemId, quantity: 1 });
    }
    // console.log(user.cart);
    await user.save();
    await user.populate("cart.itemId");

    res.status(200).json(user.cart);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove item from cart
router.post("/remove", protect, async (req, res) => {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res.status(400).json({ message: "User ID and Item ID are required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    // Find item in cart
    const cartItemIndex = user.cart.findIndex((cartItem) => cartItem.itemId.toString() === itemId);

    if (cartItemIndex > -1) {
      if (user.cart[cartItemIndex].quantity > 1) {
        user.cart[cartItemIndex].quantity -= 1; // Decrease quantity
      } else {
        user.cart.splice(cartItemIndex, 1); // Remove item if quantity is 1
      }

      await user.save();
      await user.populate("cart.itemId");
    }

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
