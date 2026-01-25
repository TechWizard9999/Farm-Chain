const typeDefs = `#graphql
  type User {
    id: ID!
    name: String!
    email: String
    phone: String
    role: String!
  }

  type AuthResponse {
    token: String!
    user: User!
  }

  type OTPResponse {
    success: Boolean!
    message: String!
    otp: String
    expiresIn: Int
  }

  type Query {
    user(identifier: String!): User
    me: User
  }

  type Mutation {
    # Authentication
    signup(name: String!, email: String, phone: String, password: String!, role: String): AuthResponse!
    login(identifier: String!, password: String!, role: String): AuthResponse!
    googleAuth(googleToken: String!, role: String): AuthResponse!
    
    # Password Reset Flow (No existing password required)
    # Step 1: Request OTP - sends to email/phone
    sendOTP(identifier: String!): OTPResponse!
    
    # Step 2: Verify OTP
    verifyOTP(identifier: String!, otp: String!): OTPResponse!
    
    # Step 3: Reset Password (after OTP verified)
    resetPassword(identifier: String!, otp: String!, newPassword: String!): OTPResponse!
    
    # Profile
    updateProfile(email: String, phone: String): User!
  }
`;

module.exports = typeDefs;
