const reviewService = require("../../services/reviewService");
const mongoose = require("mongoose");

const reviewResolver = {
  Query: {
    getReview: async (_, { id }) => {
      return reviewService.findById(id);
    },

    getOrderReview: async (_, { orderId }) => {
      return reviewService.findByOrder(orderId);
    },

    getFarmerReviews: async (_, { farmerId, limit }) => {
      return reviewService.findByFarmer(farmerId, limit || 10);
    },

    getProductReviews: async (_, { productId, limit }) => {
      return reviewService.findByProduct(productId, limit || 10);
    },

    getMyReviews: async (_, { limit }, context) => {
      if (!context.business) throw new Error("Business auth required");
      return reviewService.findByBusiness(context.business._id, limit || 10);
    },

    getFarmerRatingStats: async (_, { farmerId }) => {
      const stats = await reviewService.getFarmerStats(
        new mongoose.Types.ObjectId(farmerId),
      );
      return {
        ...stats,
        ratingDistribution: {
          one: stats.ratingDistribution[1] || 0,
          two: stats.ratingDistribution[2] || 0,
          three: stats.ratingDistribution[3] || 0,
          four: stats.ratingDistribution[4] || 0,
          five: stats.ratingDistribution[5] || 0,
        },
      };
    },

    getProductRatingStats: async (_, { productId }) => {
      return reviewService.getProductStats(
        new mongoose.Types.ObjectId(productId),
      );
    },
  },

  Mutation: {
    createReview: async (_, args, context) => {
      if (!context.business) throw new Error("Business auth required");

      const {
        orderId,
        rating,
        qualityRating,
        deliveryRating,
        communicationRating,
        comment,
        photos,
      } = args;

      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
      }

      return reviewService.create({
        order: orderId,
        reviewer: context.business._id,
        rating,
        qualityRating,
        deliveryRating,
        communicationRating,
        comment,
        photos: photos || [],
      });
    },

    updateReview: async (_, args, context) => {
      if (!context.business) throw new Error("Business auth required");

      const { id, ...updateData } = args;

      // Validate rating if provided
      if (
        updateData.rating &&
        (updateData.rating < 1 || updateData.rating > 5)
      ) {
        throw new Error("Rating must be between 1 and 5");
      }

      return reviewService.update(
        id,
        updateData,
        context.business._id.toString(),
      );
    },

    deleteReview: async (_, { id }, context) => {
      if (!context.business) throw new Error("Business auth required");
      return reviewService.delete(id, context.business._id.toString());
    },
  },

  Review: {
    id: (parent) => parent._id.toString(),
    photos: (parent) => parent.photos || [],
  },
};

module.exports = reviewResolver;
