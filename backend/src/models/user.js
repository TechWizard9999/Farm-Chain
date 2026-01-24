const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    otp: { type: String },
    otpExpiry: { type: Date }
});

module.exports = mongoose.model("User", userSchema);
