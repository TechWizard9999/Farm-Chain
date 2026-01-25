const typeDefs = `#graphql

scalar Date

type Batch {
  id: ID!
  farm: ID!
  cropCategory: String!
  cropName: String!
  variety: String
  seedSource: String
  sowingDate: Date!
  expectedHarvestDate: Date
  currentState: String!
  stateLabel: String
  activities: [Activity!]!
  harvests: [Harvest!]!
}

type Activity {
  id: ID!
  activityType: ActivityType!
  date: Date!
  productName: String
  quantity: Float
  photo: String
  whoClass: String
  notes: String
}

type Harvest {
  id: ID!
  harvestDate: Date!
  totalQty: Float!
  qualityGrade: String
  photos: [String!]!
}

enum ActivityType {
  SEEDING
  WATERING
  FERTILIZER
  PESTICIDE
  HARVEST
  PACKED
  SHIPPED
}

type JourneyState {
  currentState: String!
  stateLabel: String!
  allowedActivities: [ActivityType!]!
  isComplete: Boolean!
}

input BatchInput {
  farm: ID!
  cropCategory: String!
  cropName: String!
  variety: String
  seedSource: String
  sowingDate: Date!
  expectedHarvestDate: Date
  activities: [ActivityInput!]
  harvests: [HarvestInput!]
}

input ActivityInput {
  activityType: ActivityType!
  date: Date
  productName: String
  quantity: Float
  photo: String
  whoClass: String
  notes: String
}

input HarvestInput {
  harvestDate: Date
  totalQty: Float!
  qualityGrade: String
  photos: [String!]
}

input BatchUpdateInput {
  farm: ID
  cropCategory: String
  cropName: String
  variety: String
  seedSource: String
  sowingDate: Date
  expectedHarvestDate: Date
  activities: [ActivityInput!]
  harvests: [HarvestInput!]
}

type Query {
  getBatch(id: ID!): Batch
  listBatches(farm: ID!): [Batch!]!
  getJourneyState(batchId: ID!): JourneyState
}

type Mutation {
  createBatch(input: BatchInput!): Batch
  updateBatch(id: ID!, input: BatchUpdateInput!): Batch
  deleteBatch(id: ID!): Batch
  logActivity(batchId: ID!, input: ActivityInput!): Batch
  recordHarvest(batchId: ID!, input: HarvestInput!): Batch
}

`

module.exports = typeDefs;
