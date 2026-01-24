const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },  // Optional for Google OAuth users
    role: { type: String, enum: ['farmer', 'user'], default: 'user' },
    googleId: { type: String, unique: true, sparse: true },
    otp: { type: String },
    otpExpiry: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
