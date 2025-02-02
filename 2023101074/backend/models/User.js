import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = mongoose.Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true, unique: true},
      age: { type: Number, required: true },
      contactNumber: { type: String, required: true },
      password: { type: String, required: function() { return !this.isCasUser; } },
      isCasUser: { type: Boolean, default: false },
      cart: [
        {
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' }
        }
      ],
      reviews: [{ type: String }],
    },
    { timestamps: true }
);

userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || this.isCasUser) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    if (this.isCasUser) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const User = mongoose.model('User', userSchema);
export default User;