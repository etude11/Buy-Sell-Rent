import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const orderSchema = mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sellerorder: [{
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, items: [{
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true }, quantity: { type: Number, required: true }, status: { type: String, enum: ['Pending', 'Delivered'], default: 'Pending' },
        }]
    }],
    amount: { type: Number, required: true },
    hashedOtp: { type: String, required: true },
    // status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },

}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;