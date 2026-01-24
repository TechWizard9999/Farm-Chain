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
}

type Harvest {
  id: ID!
  harvestDate: Date!
  totalQty: Float!
  qualityGrade: String
  photos: [String!]!
}

enum ActivityType {
  FERTILIZER
  PESTICIDE
  WATERING
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
}

type Mutation {
  createBatch(input: BatchInput!): Batch
  updateBatch(id: ID!, input: BatchUpdateInput!): Batch
  deleteBatch(id: ID!): Batch
  addActivity(batchId: ID!, input: ActivityInput!): Batch
  recordHarvest(batchId: ID!, input: HarvestInput!): Batch
}

`

module.exports = typeDefs;
