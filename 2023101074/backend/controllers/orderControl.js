import Order from '../models/Order.js';
import Item from '../models/Item.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Create Order
export const placeOrder = asyncHandler(async (req, res) => {
    try {
        // console.log(req.body);
        // Group items by seller
        const itemsBySeller = {};
        const user = req.params.userId;
        console.log("user: ",user);
        let totalAmount = 0;

        // Get all items details and group by seller
        for (const cartItem of req.body) {
            const item = await Item.findById(cartItem.itemId);
            if (!item) {
                throw new Error(`Item not found: ${cartItem.itemId}`);
            }

            if (!itemsBySeller[item.seller]) {
                itemsBySeller[item.seller] = [];
            }

            itemsBySeller[item.seller].push({
                itemId: item._id,
                quantity: cartItem.quantity
            });

            totalAmount += item.price * cartItem.quantity;
        }

        // Create sellerOrder array
        const sellerOrder = Object.keys(itemsBySeller).map(sellerId => ({
            sellerId: sellerId,
            items: itemsBySeller[sellerId]
        }));

        // Hash OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        // Create new order
        const order = new Order({
            buyer: req.params.userId,
            sellerorder: sellerOrder,
            amount: totalAmount,
            hashedOtp: hashedOtp
        });

        const savedOrder = await order.save();

        // Clear user's cart
        await User.findByIdAndUpdate(user, { cart: [] });

        res.status(201).json({
            order: savedOrder,
            otp: otp // Send OTP in response for demo purposes
        });

    } catch (error) {
        console.error("Error placing order:", error);
    }
});
export const createOrder = asyncHandler(async (req, res) => {
    const { buyer, seller,items, amount, hashedOtp,status } = req.body;
    const order = new Order({ buyer, seller,items, amount, hashedOtp ,status});
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});
export const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order && order.seller.toString() === req.user._id.toString()) {
        await order.remove();
        res.json({ message: 'Order removed' });
    } else {
        res.status(404);
        throw new Error('Order not found or unauthorized');
    }
});
