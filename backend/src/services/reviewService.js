const Review = require("../models/review");
const Order = require("../models/order");

class ReviewService {
  async findById(id) {
    return Review.findById(id)
      .populate("order")
      .populate("reviewer")
      .populate("reviewee")
      .populate("product");
  }

  async findByOrder(orderId) {
    return Review.findOne({ order: orderId })
      .populate("reviewer")
      .populate("reviewee")
      .populate("product");
  }

  async findByFarmer(farmerId, limit = 10) {
    return Review.find({ reviewee: farmerId })
      .populate("reviewer")
      .populate("product")
      .populate("order")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByProduct(productId, limit = 10) {
    return Review.find({ product: productId })
      .populate("reviewer")
      .populate("reviewee")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async findByBusiness(businessId, limit = 10) {
    return Review.find({ reviewer: businessId })
      .populate("reviewee")
      .populate("product")
      .populate("order")
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async create(reviewData) {
    // Verify order exists and is delivered
    const order = await Order.findById(reviewData.order);
    if (!order) throw new Error("Order not found");
    if (order.status !== "delivered" && order.status !== "completed") {
      throw new Error("Can only review delivered orders");
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ order: reviewData.order });
    if (existingReview) {
      throw new Error("Review already exists for this order");
    }

    const review = new Review({
      ...reviewData,
      reviewee: order.farmer,
      product: order.product,
      isVerifiedPurchase: true,
    });
    const savedReview = await review.save();

    // Return with populated fields
    return Review.findById(savedReview._id)
      .populate("order")
      .populate("reviewer")
      .populate("reviewee")
      .populate("product");
  }

  async update(id, updateData, businessId) {
    const review = await Review.findById(id);
    if (!review) throw new Error("Review not found");
    if (review.reviewer.toString() !== businessId) {
      throw new Error("Not authorized to update this review");
    }

    return Review.findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate("reviewer")
      .populate("reviewee")
      .populate("product");
  }

  async delete(id, businessId) {
    const review = await Review.findById(id);
    if (!review) throw new Error("Review not found");
    if (review.reviewer.toString() !== businessId) {
      throw new Error("Not authorized to delete this review");
    }

    return Review.findByIdAndDelete(id);
  }

  async getFarmerStats(farmerId) {
    const stats = await Review.aggregate([
      { $match: { reviewee: farmerId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          averageQuality: { $avg: "$qualityRating" },
          averageDelivery: { $avg: "$deliveryRating" },
          averageCommunication: { $avg: "$communicationRating" },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: "$rating",
          },
        },
      },
    ]);

    if (stats.length === 0) {
      return {
        averageRating: 0,
        averageQuality: 0,
        averageDelivery: 0,
        averageCommunication: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    stats[0].ratingDistribution.forEach((r) => {
      distribution[r] = (distribution[r] || 0) + 1;
    });

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      averageQuality: Math.round((stats[0].averageQuality || 0) * 10) / 10,
      averageDelivery: Math.round((stats[0].averageDelivery || 0) * 10) / 10,
      averageCommunication:
        Math.round((stats[0].averageCommunication || 0) * 10) / 10,
      totalReviews: stats[0].totalReviews,
      ratingDistribution: distribution,
    };
  }

  async getProductStats(productId) {
    const stats = await Review.aggregate([
      { $match: { product: productId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (stats.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    return {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      totalReviews: stats[0].totalReviews,
    };
  }
}

module.exports = new ReviewService();
