import Order from '../models/Order.js';
import Item from '../models/Item.js';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';

// Create Order
export const placeOrder = asyncHandler(async (req, res) => {
    
    try {
        const user = req.params.userId;
        
        let totalAmount = 0;
        const itemsArray = [];

        for (const cartItem of req.body) {
          
            const item = await Item.findById(cartItem.item. _id);
            if (!item) {
                throw new Error(`Item not found: ${cartItem.itemId}`);
            }
            // Mark item as sold
            item.status = 'sold';
            await item.save();
            itemsArray.push({
                itemId: item._id,
                sellerId: item.seller,
                status: 'Pending'
            });
            totalAmount += item.price;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        const order = new Order({
            buyer: user,
            items: itemsArray,
            amount: totalAmount,
            hashedOtp,
            rawOtp: otp
        });

        const savedOrder = await order.save();
        await User.findByIdAndUpdate(user, { cart: [] });

        res.status(201).json({
            order: savedOrder,
            otp
        });

    } catch (error) {
        console.error("Error placing order:", error);
    }
});

export const confirmOrder = asyncHandler(async (req, res) => {
    try {
      const { orderId, otp } = req.body;
      const userId = req.user._id;
  
      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Verify seller is authorized
      const isSeller = order.items.some(i => i.sellerId.toString() === userId.toString());
      if (!isSeller) {
        return res.status(403).json({ message: 'Not authorized' });
      }
  
      // Verify OTP
      const isValidOtp = await bcrypt.compare(otp, order.hashedOtp);
      if (!isValidOtp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Update status for items belonging to this seller
      order.items = order.items.map(i => {
        if (i.sellerId.toString() === userId.toString()) {
          i.status = 'Completed';
        }
        return i;
      });
  
      // Save changes
      await order.save();
  
      res.json({ message: 'Order confirmed successfully' });
      
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// Fetch Orders
// export const fetchOrders = asyncHandler(async (req, res) => {
//     
//     
//     const userId = req.params.userId;
//     const orders = await Order.find({ buyer: userId }).populate('items.itemId').populate('items.sellerId');
//     res.json(orders);
// });

// ...existing code...
export const getPendingOrders = asyncHandler(async (req, res) => {
    try {
      const userId = req.user._id;
      
      const orders = await Order.find({
        buyer: userId,
        'items.status': 'Pending'
      })
      .populate('buyer')
      .populate('items.itemId');

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  // ...existing code...

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

export const getSellerOrders = asyncHandler(async (req, res) => {
  try {
      
        const sellerId = req.user._id;
        
        
        const orders = await Order.find({
            'items.sellerId': sellerId,
            'items.status': 'Pending'
        })
        .populate('buyer', 'name email')
        .populate('items.itemId');

        // Format the response to match frontend expectations
        const formattedOrders = orders.map(order => {
            const sellerItems = order.items.filter(
                item => item.sellerId.toString() === sellerId.toString()
            );
            
            return sellerItems.map(item => ({
                _id: order._id,
                buyer: order.buyer,
                item: item.itemId,
                status: item.status,
                hashedOtp: order.hashedOtp
            }));
        }).flat();
        
        res.json(formattedOrders);
    } catch (error) {
      
        res.status(500).json({ message: error.message });
    }
});

export const completeDelivery = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { otp } = req.body;
        const sellerId = req.user._id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify OTP
        const isValidOtp = await bcrypt.compare(otp, order.hashedOtp);
        if (!isValidOtp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update status for seller's items
        const updated = await Order.findOneAndUpdate(
            {
                _id: orderId,
                'items.sellerId': sellerId
            },
            {
                $set: {
                    'items.$.status': 'Completed'
                }
            },
            { new: true }
        );

        if (!updated) {
            return res.status(400).json({ message: 'Update failed' });
        }

        res.json({ success: true, message: 'Delivery completed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user's bought items
// @route   GET /api/orders/bought
// @access  Private
export const getBoughtItems = async (req, res) => {
    try {
        const orders = await Order.find({ 
            buyer: req.user._id,
            'items.status': 'Completed'
        })
        .populate('items.itemId')
        .populate('buyer');

        // Format the bought items to match the structure
        const boughtItems = orders.flatMap(order => {
            return order.items
                .filter(item => item.status === 'Completed')
                .map(item => ({
                    _id: order._id,
                    items: [{
                        itemId: item.itemId,
                        status: item.status
                    }],
                    buyer: order.buyer,
                    createdAt: order.createdAt
                }));
        });

        res.json(boughtItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's sold items
// @route   GET /api/orders/sold
// @access  Private
export const getSoldItems = async (req, res) => {
    
    try {
        const orders = await Order.find({ 
            'items.sellerId': req.user._id,
            'items.status': 'Completed'
        })
        .populate('buyer')
        .populate('items.itemId');

        // Extract and format only the sold items by this seller
        const soldItems = orders.flatMap(order => {
            return order.items
                .filter(item => 
                    item.sellerId.toString() === req.user._id.toString() && 
                    item.status === 'Completed'
                )
                .map(item => ({
                    _id: order._id,
                    items: [{
                        itemId: item.itemId,
                        status: item.status
                    }],
                    buyer: order.buyer,
                    createdAt: order.createdAt
                }));
        });

        res.json(soldItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
