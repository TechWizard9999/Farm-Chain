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
        notes
      }
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

export const GET_JOURNEY_STATE_QUERY = `
  query GetJourneyState($batchId: ID!) {
    getJourneyState(batchId: $batchId) {
      currentState
      stateLabel
      allowedActivities
      isComplete
    }
  }
`;

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
        notes
      }
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
