import express from 'express';
import { getItems, createItem, updateItem, deleteItem, getItemById } from '../controllers/itemControl.js';
import { createOrder, deleteOrder } from '../controllers/orderControl.js';

import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/')
  .get(getItems)
  .post(protect, createItem);

// Move this route before the update/delete route to avoid conflicts
router.get('/:id', protect, getItemById);

router.route('/:id')
  .put(protect, updateItem)
  .delete(protect, deleteItem);

export default router;