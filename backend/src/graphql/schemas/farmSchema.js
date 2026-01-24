const typeDefs = `#graphql
  type Coordinates {
    latitude: Float!
    longitude: Float!
  }
  input CoordinatesInput {
    latitude: Float!
    longitude: Float!
  }
  type Farm {
    id: ID!
    location: Coordinates!
    size: Float!
    pinCode: String!
    soilType: String!
    organicStatus: String!
    photo: String!
  }
  
  type Query {
    farm(id: ID!): Farm
    farms: [Farm!]
  }
  
  type Mutation {
    createFarm(location: CoordinatesInput!, size: Float!, pinCode: String!, soilType: String!, organicStatus: String!, photo: String!): Farm!
    updateFarm(id: ID!, location: CoordinatesInput, size: Float, pinCode: String, soilType: String, organicStatus: String, photo: String): Farm!
    deleteFarm(id: ID!): Farm!
  }
`

module.exports = typeDefs;