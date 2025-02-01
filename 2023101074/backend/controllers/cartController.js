
import User from '../models/User.js';
import Item from '../models/Item.js';
import asyncHandler from 'express-async-handler';

export const addToCart = asyncHandler(async (req, res) => {
  const { userId, itemId } = req.body;
  const user = await User.findById(userId);
  const item = await Item.findById(itemId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  // Update item status
  item.status = 'incart';
  await item.save();

  user.cart.push({ item: item._id });
  await user.save();

  res.json(user.cart);
});