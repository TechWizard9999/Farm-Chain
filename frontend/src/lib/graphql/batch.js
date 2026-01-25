export const CREATE_BATCH_MUTATION = `
  mutation CreateBatch($input: BatchInput!) {
    createBatch(input: $input) {
      id
      cropCategory
      cropName
      variety
      seedSource
      sowingDate
      expectedHarvestDate
      currentState
      stateLabel
    }
  }
`;

// ... (previous queries)

export const LIST_BATCHES_QUERY = `
  query ListBatches($farm: ID!) {
    listBatches(farm: $farm) {
      id
      cropCategory
      cropName
      variety
      seedSource
      sowingDate
      expectedHarvestDate
      currentState
      stateLabel
      activities {
        id
        activityType
        date
        quantity
        notes
        isOrganic
        blockchainStatus
        blockchainTxHash
        blockchainBlock
      }
    }
  }
`;

export const LIST_BATCHES_SIMPLE_QUERY = `
  query ListBatches($farm: ID!) {
    listBatches(farm: $farm) {
      id
      cropCategory
      cropName
      variety
      currentState
      stateLabel
    }
  }
`;

export const GET_BATCH_QUERY = `
  query GetBatch($id: ID!) {
    getBatch(id: $id) {
      id
      farm
      cropCategory
      cropName
      variety
      seedSource
      sowingDate
      expectedHarvestDate
      currentState
      stateLabel
      activities {
        id
        activityType
        date
        productName
        quantity
        notes
        isOrganic
        blockchainStatus
        blockchainTxHash
        blockchainBlock
      }
      harvests {
        id
        harvestDate
        totalQty
        qualityGrade
      }
    }
  }
`;

// ... (GET_JOURNEY_STATE_QUERY remains same)

export const LOG_ACTIVITY_MUTATION = `
  mutation LogActivity($batchId: ID!, $input: ActivityInput!) {
    logActivity(batchId: $batchId, input: $input) {
      id
      currentState
      stateLabel
      activities {
        id
        activityType
        date
        quantity
        notes
        isOrganic
        blockchainStatus
        blockchainTxHash
      }
    }
  }
`;

export const VERIFY_ORGANIC_QUERY = `
  query VerifyOrganic($batchId: ID!) {
    verifyOrganic(batchId: $batchId) {
      isOrganic
      activityCount
      verified
    }
  }
`;

export const DELETE_BATCH_MUTATION = `
  mutation DeleteBatch($id: ID!) {
    deleteBatch(id: $id) {
      id
    }
  }
`;
