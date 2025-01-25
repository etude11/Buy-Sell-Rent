import express from 'express';
import { getItems, createItem ,updateItem,deleteItem} from '../controllers/itemControl.js';
import { createOrder , deleteOrder} from '../controllers/orderControl.js';

import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(getItems).post(protect, createItem);
// routes/itemRoutes.js (Updated)
router.route('/:id').put(protect, updateItem).delete(protect, deleteItem);

// routes/orderRoutes.js (Updated)
router.route('/:id').delete(protect, deleteOrder);
export default router;