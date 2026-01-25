const auctionService = require("../../services/auctionService");

const auctionResolver = {
    Query: {
        getAuction: async (_, { id }) => {
            return auctionService.findById(id);
        },
        myAuctions: async (_, __, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return auctionService.findByFarmer(context.user._id);
        },
        openAuctions: async () => {
            return auctionService.findOpen();
        },
        auctionBids: async (_, { auctionId }) => {
            return auctionService.getBidsForAuction(auctionId);
        },
        myBids: async (_, __, context) => {
            if (!context.business && !context.user) throw new Error("Authentication required");
            const bidderId = context.business ? context.business._id : context.user._id;
            return auctionService.findBidsByBidder(bidderId);
        }
    },

    Mutation: {
        createAuction: async (_, { productId, batchId, minPricePerKg, quantity, deadline }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            
            const deadlineDate = new Date(deadline);
            if (isNaN(deadlineDate.getTime())) {
                throw new Error("Invalid deadline date");
            }
            if (deadlineDate <= new Date()) {
                 throw new Error("Deadline must be in the future");
            }

            return auctionService.create({
                farmer: context.user._id,
                product: productId,
                batch: batchId,
                minPricePerKg,
                quantity,
                deadline: deadlineDate
            });
        },

        placeBid: async (_, { auctionId, pricePerKg }, context) => {
            // Allow both businesses and consumers to place bids
            if (!context.business && !context.user) throw new Error("Authentication required");
            
            if (context.business) {
                return auctionService.placeBid(auctionId, context.business._id, pricePerKg, 'business');
            } else {
                return auctionService.placeBid(auctionId, context.user._id, pricePerKg, 'user');
            }
        },

        closeAuction: async (_, { auctionId }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return auctionService.closeAuction(auctionId, context.user._id.toString());
        },

        awardAuction: async (_, { auctionId }, context) => {
            if (!context.user) throw new Error("Farmer auth required");
            return auctionService.awardAuction(auctionId, context.user._id.toString());
        }
    },

    Auction: {
        id: (parent) => parent._id.toString(),
        deadline: (parent) => {
            if (!parent.deadline) return null;
            const date = new Date(parent.deadline);
            return isNaN(date.getTime()) ? null : date.toISOString();
        },
        createdAt: (parent) => {
            if (!parent.createdAt) return null;
            const date = new Date(parent.createdAt);
            return isNaN(date.getTime()) ? null : date.toISOString();
        }
    },

    Bid: {
        id: (parent) => parent._id.toString()
    }
};

module.exports = auctionResolver;
