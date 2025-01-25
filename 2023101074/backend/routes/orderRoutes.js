import express from "express";
// const router = express.Router();
import { placeOrder,createOrder , deleteOrder} from '../controllers/orderControl.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/:userId').post(protect, placeOrder);
export default router;