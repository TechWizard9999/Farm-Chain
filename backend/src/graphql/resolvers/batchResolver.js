const BatchService = require("../../services/batchService");

const batchResolver = {
    Query: {
        getBatch: (_, { id }, context) => {
            return BatchService.findById(id);
        },
        listBatches: (_, { farm }, context) => {
            return BatchService.findByFarm(farm);
        }
    },
    Mutation: {
        createBatch: (_, { input }, context) => {
            return BatchService.create(input);
        },
        updateBatch: (_, { id, input }, context) => {
            return BatchService.update(id, input);
        },
        deleteBatch: (_, { id }, context) => {
            return BatchService.delete(id);
        },
        addActivity: (_, { batchId, input }, context) => {
            return BatchService.addActivity(batchId, input);
        },
        recordHarvest: (_, { batchId, input }, context) => {
            return BatchService.recordHarvest(batchId, input);
        }
    }
};

module.exports = batchResolver;
