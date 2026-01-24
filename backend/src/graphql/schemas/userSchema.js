const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String
    phone: String
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type OTPResponse {
    success: Boolean!
    message: String!
    otp: String
  }

  type Query {
    user(identifier: String!): User
  }

  type Mutation {
    signup(name: String!, email: String, phone: String, password: String!): AuthResponse!
    login(identifier: String!, password: String!): AuthResponse!
    sendOTP(identifier: String!): OTPResponse!
    verifyOTP(identifier: String!, otp: String!): OTPResponse!
    resetPassword(identifier: String!, otp: String!, newPassword: String!): OTPResponse!
    updateProfile(email: String, phone: String): User!
  }
`;

module.exports = typeDefs;
