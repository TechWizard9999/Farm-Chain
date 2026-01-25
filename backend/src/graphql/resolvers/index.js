
const userResolvers = require("./userResolver");
const farmResolver = require("./farmResolver");
const batchResolver = require("./batchResolver");
const businessResolver = require("./businessResolver");
const productResolver = require("./productResolver");
const orderResolver = require("./orderResolver");
const auctionResolver = require("./auctionResolver");
const reviewResolver = require("./reviewResolver");
const profileResolver = require("./profileResolver");
const geocodingResolver = require("./geocodingResolver");

const resolvers = {
    Query: {
        ...userResolvers.Query,
        ...farmResolver.Query,
        ...batchResolver.Query,
        ...businessResolver.Query,
        ...productResolver.Query,
        ...orderResolver.Query,
        ...auctionResolver.Query,
        ...reviewResolver.Query,
        ...profileResolver.Query,
        ...geocodingResolver.Query
    },
    Mutation: {
        ...userResolvers.Mutation,
        ...farmResolver.Mutation,
        ...batchResolver.Mutation,
        ...businessResolver.Mutation,
        ...productResolver.Mutation,
        ...orderResolver.Mutation,
        ...auctionResolver.Mutation,
        ...reviewResolver.Mutation,
        ...profileResolver.Mutation
    },
    User: userResolvers.User,
    Business: businessResolver.Business,
    Product: productResolver.Product,
    Order: orderResolver.Order,
    Auction: auctionResolver.Auction,
    Bid: auctionResolver.Bid,
    Review: reviewResolver.Review,
    Batch: batchResolver.Batch,
};

module.exports = resolvers;
