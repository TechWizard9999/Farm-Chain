const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    activityType: {
        type: String,
        enum: ["SEEDING", "WATERING", "FERTILIZER", "PESTICIDE", "HARVEST", "PACKED", "SHIPPED"],
        required: true
    },
    date: { type: Date, required: true },
    productName: { type: String },
    quantity: { type: Number },
    isOrganic: { type: Boolean, default: false },
    photo: { type: String },
    whoClass: { type: String },
    notes: { type: String },
    blockchainTxHash: { type: String },
    blockchainBlock: { type: Number },
    blockchainStatus: { 
        type: String, 
        enum: ["pending", "confirmed", "failed"],
        default: "pending"
    }
});

const harvestSchema = new mongoose.Schema({
    harvestDate: { type: Date, required: true },
    totalQty: { type: Number, required: true },
    qualityGrade: { type: String },
    photos: [String]
});

const batchSchema = new mongoose.Schema({
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Farm",
        required: true
    },
    cropCategory: { type: String, required: true },
    cropName: { type: String, required: true },
    variety: { type: String },
    seedSource: { type: String },
    sowingDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date },
    currentState: { 
        type: String, 
        enum: ["idle", "seeding", "watering", "fertilizer", "pesticide", "harvest", "packed", "shipped"],
        default: "idle"
    },
    activities: [activitySchema],
    harvests: [harvestSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Batch", batchSchema);
