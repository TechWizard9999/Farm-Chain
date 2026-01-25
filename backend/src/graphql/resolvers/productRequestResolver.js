const ProductRequest = require("../../models/productRequest");
const User = require("../../models/user");

const productRequestResolver = {
  Query: {
    getProductRequests: async (_, __, { user }) => {
      // Return all open requests (for farmers to see)
      return await ProductRequest.find({ status: "open" })
        .populate("consumer")
        .populate("offers.farmer")
        .populate("acceptedOffer.farmer")
        .sort({ createdAt: -1 });
    },
    getMyProductRequests: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await ProductRequest.find({ consumer: user._id })
        .populate("consumer")
        .populate("offers.farmer")
        .populate("acceptedOffer.farmer")
        .sort({ createdAt: -1 });
    },
    getProductRequest: async (_, { id }) => {
      return await ProductRequest.findById(id)
        .populate("consumer")
        .populate("offers.farmer")
        .populate("acceptedOffer.farmer");
    },
    getMyOffers: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      // Find all requests where this farmer has made an offer
      return await ProductRequest.find({ "offers.farmer": user._id })
        .populate("consumer")
        .populate("offers.farmer")
        .populate("acceptedOffer.farmer")
        .sort({ createdAt: -1 });
    },
  },
  Mutation: {
    createProductRequest: async (_, { input }, { user }) => {
      if (!user) throw new Error("Not authenticated");
      const newRequest = new ProductRequest({
        ...input,
        consumer: user._id,
      });
      return await newRequest.save();
    },
    offerOnProductRequest: async (_, { input }, { user }) => {
        if (!user) throw new Error("Not authenticated");
        
        const request = await ProductRequest.findById(input.requestId);
        if (!request) throw new Error("Request not found");
        if (request.status !== 'open') throw new Error("Request is not open");

        // Check if farmer already made an offer
        const existingOffer = request.offers.find(
          o => o.farmer.toString() === user._id.toString()
        );
        if (existingOffer) throw new Error("You have already made an offer on this request");

        const offer = {
            farmer: user._id,
            pricePerKg: input.pricePerKg,
            message: input.message,
            status: 'pending'
        };

        request.offers.push(offer);
        await request.save();
        
        return await ProductRequest.findById(request._id)
          .populate("consumer")
          .populate("offers.farmer")
          .populate("acceptedOffer.farmer");
    },
    acceptOffer: async (_, { requestId, offerIndex }, { user }) => {
        if (!user) throw new Error("Not authenticated");
        
        const request = await ProductRequest.findById(requestId);
        if (!request) throw new Error("Request not found");
        if (request.consumer.toString() !== user._id.toString()) {
          throw new Error("Not authorized");
        }
        if (request.status !== 'open') throw new Error("Request is not open");
        if (offerIndex < 0 || offerIndex >= request.offers.length) {
          throw new Error("Invalid offer index");
        }

        const acceptedOffer = request.offers[offerIndex];
        
        // Mark all offers as rejected except the accepted one
        request.offers.forEach((offer, idx) => {
          offer.status = idx === offerIndex ? 'accepted' : 'rejected';
        });

        // Set the accepted offer details
        request.acceptedOffer = {
          farmer: acceptedOffer.farmer,
          pricePerKg: acceptedOffer.pricePerKg,
          message: acceptedOffer.message,
          acceptedAt: new Date()
        };

        request.status = 'fulfilled';
        await request.save();
        
        return await ProductRequest.findById(request._id)
          .populate("consumer")
          .populate("offers.farmer")
          .populate("acceptedOffer.farmer");
    },
    rejectOffer: async (_, { requestId, offerIndex }, { user }) => {
        if (!user) throw new Error("Not authenticated");
        
        const request = await ProductRequest.findById(requestId);
        if (!request) throw new Error("Request not found");
        if (request.consumer.toString() !== user._id.toString()) {
          throw new Error("Not authorized");
        }
        if (offerIndex < 0 || offerIndex >= request.offers.length) {
          throw new Error("Invalid offer index");
        }

        request.offers[offerIndex].status = 'rejected';
        await request.save();
        
        return await ProductRequest.findById(request._id)
          .populate("consumer")
          .populate("offers.farmer")
          .populate("acceptedOffer.farmer");
    },
    closeProductRequest: async (_, { id }, { user }) => {
        if (!user) throw new Error("Not authenticated");
        const request = await ProductRequest.findById(id);
        if (!request) throw new Error("Request not found");
        if (request.consumer.toString() !== user._id.toString()) throw new Error("Not authorized");

        request.status = 'fulfilled';
        return await request.save();
    },
    cancelProductRequest: async (_, { id }, { user }) => {
        if (!user) throw new Error("Not authenticated");
        const request = await ProductRequest.findById(id);
        if (!request) throw new Error("Request not found");
        if (request.consumer.toString() !== user._id.toString()) throw new Error("Not authorized");

        // Mark all pending offers as rejected
        request.offers.forEach(offer => {
          if (offer.status === 'pending') {
            offer.status = 'rejected';
          }
        });

        request.status = 'cancelled';
        return await request.save();
    }
  },
  ProductRequestOffer: {
    id: (parent) => parent._id?.toString() || null
  }
};

module.exports = productRequestResolver;
