const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch", required: true },
    minPricePerKg: { type: Number, required: true },
    quantity: { type: Number, required: true },
    highestBid: { type: Number, default: 0 },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, refPath: 'highestBidderType' },
    highestBidderType: { type: String, enum: ['Business', 'User'], default: 'Business' },
    deadline: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['open', 'closed', 'awarded', 'expired', 'cancelled'],
        default: 'open'
    }
}, { timestamps: true });

module.exports = mongoose.model("Auction", auctionSchema);
