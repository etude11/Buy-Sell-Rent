import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userControl.js';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
const router = express.Router();
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
export default router;