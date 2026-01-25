const typeDefs = `#graphql

type UserProfile {
  id: ID!
  name: String!
  phoneNumber: String!
  profilePhoto: String
  languagePreference: Language
  bankDetails: BankDetails
  notificationSettings: NotificationSettings
}

type BankDetails {
  upiId: String
  bankAccountNumber: String
  ifscCode: String
  accountHolderName: String
}

type NotificationSettings {
  orderAlerts: Boolean!
  paymentAlerts: Boolean!
  bidUpdates: Boolean!
  weatherAlerts: Boolean!
}

enum Language {
  ENGLISH
  HINDI
  KANNADA
  TELUGU
  TAMIL

}

input UpdateProfileInput {
  name: String
  phoneNumber: String
  profilePhoto: String
  languagePreference: Language
}

input CreateProfileInput {
  user: ID!
  name: String!
  phoneNumber: String!
  profilePhoto: String
  languagePreference: Language
}

input BankDetailsInput {
  upiId: String
  bankAccountNumber: String
  ifscCode: String
  accountHolderName: String
}

input NotificationSettingsInput {
  orderAlerts: Boolean
  paymentAlerts: Boolean
  bidUpdates: Boolean
  weatherAlerts: Boolean
}

type Query {
  getMyProfile: UserProfile
  getUserProfile(userId: ID!): UserProfile
}

type Mutation {
  createUserProfile(input: CreateProfileInput!): UserProfile
  updateUserProfile(input: UpdateProfileInput!): UserProfile
  updateUserBankDetails(input: BankDetailsInput!): UserProfile
  updateUserNotificationSettings(input: NotificationSettingsInput!): UserProfile
  deleteUserProfile(userId: ID!): UserProfile
  logout: Boolean
}

`

module.exports = typeDefs;