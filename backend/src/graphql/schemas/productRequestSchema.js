const typeDefs = `#graphql
    type ProductRequestOffer {
        id: ID
        farmer: User
        pricePerKg: Float!
        message: String
        status: String
        createdAt: String
    }

    type AcceptedOffer {
        farmer: User
        pricePerKg: Float
        message: String
        acceptedAt: String
    }

    type ProductRequest {
        id: ID!
        consumer: User
        productName: String!
        quantity: Float!
        budgetPerKg: Float
        description: String
        status: String!
        acceptedOffer: AcceptedOffer
        offers: [ProductRequestOffer]
        createdAt: String
        updatedAt: String
    }

    input CreateProductRequestInput {
        productName: String!
        quantity: Float!
        budgetPerKg: Float
        description: String
    }

    input CreateRequestOfferInput {
        requestId: ID!
        pricePerKg: Float!
        message: String
    }

    extend type Query {
        getProductRequests: [ProductRequest]
        getMyProductRequests: [ProductRequest]
        getProductRequest(id: ID!): ProductRequest
        getMyOffers: [ProductRequest]
    }

    extend type Mutation {
        createProductRequest(input: CreateProductRequestInput!): ProductRequest
        offerOnProductRequest(input: CreateRequestOfferInput!): ProductRequest
        acceptOffer(requestId: ID!, offerIndex: Int!): ProductRequest
        rejectOffer(requestId: ID!, offerIndex: Int!): ProductRequest
        closeProductRequest(id: ID!): ProductRequest
        cancelProductRequest(id: ID!): ProductRequest
    }
`;

module.exports = typeDefs;
