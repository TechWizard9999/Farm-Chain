const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    activityType: {
        type: String,
        enum: ["FERTILIZER", "PESTICIDE", "WATERING"],
        required: true
    },
    date: { type: Date, required: true },
    productName: { type: String },
    quantity: { type: Number },
    photo: { type: String },
    whoClass: { type: String }
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
    activities: [activitySchema],
    harvests: [harvestSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model("Batch", batchSchema);
