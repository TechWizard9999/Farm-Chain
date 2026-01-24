const typeDefs = `#graphql

type Review {
    id: ID!
    order: Order
    reviewer: Business
    reviewee: User
    product: Product
    rating: Int!
    qualityRating: Int
    deliveryRating: Int
    communicationRating: Int
    comment: String
    photos: [String!]!
    isVerifiedPurchase: Boolean!
    createdAt: String!
}

type FarmerRatingStats {
    averageRating: Float!
    averageQuality: Float!
    averageDelivery: Float!
    averageCommunication: Float!
    totalReviews: Int!
    ratingDistribution: RatingDistribution!
}

type RatingDistribution {
    one: Int!
    two: Int!
    three: Int!
    four: Int!
    five: Int!
}

type ProductRatingStats {
    averageRating: Float!
    totalReviews: Int!
}

type Query {
    getReview(id: ID!): Review
    getOrderReview(orderId: ID!): Review
    getFarmerReviews(farmerId: ID!, limit: Int): [Review!]!
    getProductReviews(productId: ID!, limit: Int): [Review!]!
    getMyReviews(limit: Int): [Review!]!
    getFarmerRatingStats(farmerId: ID!): FarmerRatingStats!
    getProductRatingStats(productId: ID!): ProductRatingStats!
}

type Mutation {
    createReview(
        orderId: ID!
        rating: Int!
        qualityRating: Int
        deliveryRating: Int
        communicationRating: Int
        comment: String
        photos: [String!]
    ): Review!
    
    updateReview(
        id: ID!
        rating: Int
        qualityRating: Int
        deliveryRating: Int
        communicationRating: Int
        comment: String
        photos: [String!]
    ): Review!
    
    deleteReview(id: ID!): Review
}

`;

module.exports = typeDefs;
