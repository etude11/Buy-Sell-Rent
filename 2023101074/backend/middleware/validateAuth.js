import asyncHandler from 'express-async-handler';

export const validateRegistration = asyncHandler(async (req, res, next) => {
    const { isCasUser, password, email, firstName, lastName, age, contactNumber } = req.body;

    // Common validation for all registrations
    if (!firstName || !lastName || !email || !age || !contactNumber) {
        res.status(400);
        throw new Error('Please fill all required fields');
    }

    // Validate password only for non-CAS users
    if (!isCasUser && !password) {
        res.status(400);
        throw new Error('Password is required for manual registration');
    }

    // Password strength validation for non-CAS users
    // if (!isCasUser && password.length < 6) {
    //     res.status(400);
    //     throw new Error('Password must be at least 6 characters long');
    // }

    next();
});

export const validateLogin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    next();
});
