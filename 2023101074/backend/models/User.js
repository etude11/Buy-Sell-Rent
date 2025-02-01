// const mongoose = require('mongoose');
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import module from 'module';

const userSchema = mongoose.Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true, match: /@iiit\.ac\.in$/ },
      age: { type: Number, required: true },
      contactNumber: { type: String, required: true },
      password: { type: String, required: true },
      cart: [
        {
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
        }
      ],
      reviews: [{ type: String }],
    },
    { timestamps: true }
  );

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const User = mongoose.model('User', userSchema);
export default User;