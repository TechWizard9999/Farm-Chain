const mongoose = require("mongoose");

const productRequestSchema = new mongoose.Schema({
    consumer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    budgetPerKg: { type: Number },
    description: { type: String },
    status: { 
        type: String, 
        enum: ['open', 'fulfilled', 'cancelled', 'expired'],
        default: 'open'
    },
    acceptedOffer: {
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        pricePerKg: Number,
        message: String,
        acceptedAt: Date
    },
    offers: [{
        farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        pricePerKg: { type: Number, required: true },
        message: String,
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        },
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model("ProductRequest", productRequestSchema);
