const typeDefs = `#graphql

type Auction {
    id: ID!
    farmer: User
    product: Product
    minPricePerKg: Float!
    quantity: Float!
    highestBid: Float!
    highestBidder: Business
    deadline: String!
    status: String!
    createdAt: String!
}

type Bid {
    id: ID!
    auction: Auction
    business: Business
    pricePerKg: Float!
    quantity: Float!
    bidAmount: Float!
    status: String!
    createdAt: String!
}

type Query {
    getAuction(id: ID!): Auction
    myAuctions: [Auction!]!
    openAuctions: [Auction!]!
    auctionBids(auctionId: ID!): [Bid!]!
    myBids: [Bid!]!
}

type Mutation {
    createAuction(productId: ID!, batchId: ID!, minPricePerKg: Float!, quantity: Float!, deadline: String!): Auction!
    placeBid(auctionId: ID!, pricePerKg: Float!): Auction!
    closeAuction(auctionId: ID!): Auction!
    awardAuction(auctionId: ID!): Auction!
}

`

module.exports = typeDefs;
