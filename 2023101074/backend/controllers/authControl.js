import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import {generateToken} from '../utils/generateToken.js';

// Register User
export const registerUser = asyncHandler(async (req, res) => {
    console.log("Insdie registerUser");
    try {
        const { firstName, lastName, email, age, contactNumber, password, isCasUser } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Additional validation for non-CAS users

        const user = await User.create({
            firstName,
            lastName,
            email,
            age,
            contactNumber,
            password,
            isCasUser
        });
        
        if (user) {
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        console.error(error);
        res.status(500);
        throw new Error('Server error during registration');
    }
});

// Login User
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    if (user.isCasUser) {
        res.status(401);
        throw new Error('Please use CAS login for this account');
    }

    if (await user.matchPassword(password)) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});