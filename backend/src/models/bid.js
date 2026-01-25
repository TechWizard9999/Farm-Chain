const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction", required: true },
    business: { type: mongoose.Schema.Types.ObjectId, ref: "Business" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    pricePerKg: { type: Number, required: true },
    quantity: { type: Number, required: true },
    bidAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model("Bid", bidSchema);
