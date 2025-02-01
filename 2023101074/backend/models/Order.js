import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const orderSchema = mongoose.Schema({
    buyer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    items: [{
        itemId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Item', 
            required: true 
        },
        sellerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: true 
        },
        status: { 
            type: String, 
            enum: ['Pending', 'Completed'], 
            default: 'Pending' 
        }
    }],
    amount: { 
        type: Number, 
        required: true 
    },
    hashedOtp: { 
        type: String, 
        required: true 
    },
    rawOtp: {
        type: String,
        required: true
    }
}, { 
    timestamps: true 
});

// Add index for better query performance
orderSchema.index({ 'items.sellerId': 1, 'items.status': 1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;