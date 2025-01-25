import Item from '../models/Item.js';
import asyncHandler from 'express-async-handler';

// Get All Items
export const getItems = asyncHandler(async (req, res) => {
    const items = await Item.find().populate('seller', 'firstName lastName email');
    res.json(items);
});

// Create Item
export const createItem = asyncHandler(async (req, res) => {
    const { name, price, description, category } = req.body;
    const item = new Item({ name, price, description, category, seller: req.user._id });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
});
export const updateItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (item && item.seller.toString() === req.user._id.toString()) {
        item.name = req.body.name || item.name;
        item.price = req.body.price || item.price;
        item.description = req.body.description || item.description;
        item.category = req.body.category || item.category;
        const updatedItem = await item.save();
        res.json(updatedItem);
    } else {
        res.status(404);
        throw new Error('Item not found or unauthorized');
    }
});

// Delete Item
export const deleteItem = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (item && item.seller.toString() === req.user._id.toString()) {
        await item.remove();
        res.json({ message: 'Item removed' });
    } else {
        res.status(404);
        throw new Error('Item not found or unauthorized');
    }
});
