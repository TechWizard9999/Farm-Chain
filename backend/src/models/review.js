const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true, // One review per order
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    qualityRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    communicationRating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: { type: String },
    photos: [String],
    isVerifiedPurchase: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Index for fast lookups
reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ product: 1 });
reviewSchema.index({ reviewer: 1 });

module.exports = mongoose.model("Review", reviewSchema);
