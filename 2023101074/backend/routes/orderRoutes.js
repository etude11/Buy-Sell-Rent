import express from "express";
import { 
    placeOrder, 
    confirmOrder, 
    createOrder, 
    deleteOrder, 
    // fetchOrders, 
    getPendingOrders,
    getSellerOrders,
    completeDelivery,
    getBoughtItems,
    getSoldItems
} from '../controllers/orderControl.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Reorder routes - most specific first
router.route('/pending').get(protect, getPendingOrders);
router.route('/place/:userId').post(protect, placeOrder);
// router.route('/:userId').get(protect, fetchOrders);
router.post('/confirm', protect, confirmOrder);
router.get('/seller', protect, getSellerOrders);
router.post('/:orderId/complete', protect, completeDelivery);

router.get('/bought', protect, getBoughtItems);
router.get('/sold', protect, getSoldItems);

export default router;