import express from "express";
// const router = express.Router();
import { placeOrder,createOrder , deleteOrder, fetchOrders} from '../controllers/orderControl.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/place/:userId').post(protect, placeOrder);

router.route('/:userId').get(protect,fetchOrders );
export default router;