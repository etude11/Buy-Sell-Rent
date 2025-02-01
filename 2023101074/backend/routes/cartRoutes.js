import express from "express";
const router = express.Router();
import User from "../models/User.js";
import Item from "../models/Item.js";
// import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

// Get user's cart
router.get("/:userId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'cart',
      populate: {
        path: 'item', // Correct key here based on your userSchema
        model: 'Item', // Specify the model name for the items
        select: 'name price description category status seller' // Fields to retrieve from the Item model
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.cart);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add item to cart
router.post("/add", protect, async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "User ID and Item ID are required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Set item status
    item.status = 'incart';
    await item.save();

    // Add item reference
    user.cart.push({ item: item._id });
    await user.save();
    await user.populate({
      path: 'cart',
      populate: { path: 'item', model: 'Item' }
    });

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Remove item from cart
router.post("/removeItem", protect, async (req, res) => {
  const { userId, itemId } = req.body;
  if (!userId || !itemId) {
    return res.status(400).json({ message: "User ID and Item ID are required" });
  }
  try {
    const user = await User.findById(userId).populate('cart.item');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Remove the item from cart
    user.cart = user.cart.filter(entry => entry.item._id.toString() !== itemId);

    // Change item status to available
    const item = await Item.findById(itemId);
    if (item) {
      item.status = 'available';  // Changed from 'incart' to 'available'
      await item.save();
    }

    await user.save();
    await user.populate({
      path: 'cart',
      populate: { path: 'item', model: 'Item' }
    });

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
