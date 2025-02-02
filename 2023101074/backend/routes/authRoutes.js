import express from 'express';
import { registerUser, loginUser } from '../controllers/authControl.js';
import { validateRegistration, validateLogin } from '../middleware/validateAuth.js';

const router = express.Router();

// Manual registration with password validation
router.post('/register', validateRegistration, registerUser);

// Manual login with required fields validation
router.post('/login', validateLogin, loginUser);

export default router;