const BatchService = require("../../services/batchService");
const { 
    getAllowedActivities, 
    canDoActivity, 
    getNextState, 
    isJourneyComplete,
    getStateLabel 
} = require("../../stateMachines/journeyStateMachine");

const batchResolver = {
    Query: {
        getBatch: (_, { id }, context) => {
            return BatchService.findById(id);
        },
        listBatches: (_, { farm }, context) => {
            return BatchService.findByFarm(farm);
        },
        getJourneyState: async (_, { batchId }, context) => {
            const batch = await BatchService.findById(batchId);
            if (!batch) throw new Error("Batch not found");
            
            const currentState = batch.currentState || "idle";
            return {
                currentState,
                stateLabel: getStateLabel(currentState),
                allowedActivities: getAllowedActivities(currentState),
                isComplete: isJourneyComplete(currentState)
            };
        }
    },
    
    Mutation: {
        createBatch: (_, { input }, context) => {
            return BatchService.create({ ...input, currentState: "idle" });
        },
        updateBatch: (_, { id, input }, context) => {
            return BatchService.update(id, input);
        },
        deleteBatch: (_, { id }, context) => {
            return BatchService.delete(id);
        },
        logActivity: async (_, { batchId, input }, context) => {
            const batch = await BatchService.findById(batchId);
            if (!batch) throw new Error("Batch not found");
            
            const currentState = batch.currentState || "idle";
            const activityType = input.activityType;
            
            if (!canDoActivity(currentState, activityType)) {
                const allowed = getAllowedActivities(currentState);
                throw new Error(
                    `Cannot log ${activityType} from state "${getStateLabel(currentState)}". ` +
                    `Allowed activities: ${allowed.join(", ") || "none"}`
                );
            }
            
            const nextState = getNextState(currentState, activityType);
            
            return BatchService.logActivity(batchId, input, nextState);
        },
        recordHarvest: async (_, { batchId, input }, context) => {
            const batch = await BatchService.findById(batchId);
            if (!batch) throw new Error("Batch not found");
            
            const currentState = batch.currentState || "idle";
            
            if (!canDoActivity(currentState, "HARVEST")) {
                throw new Error(
                    `Cannot harvest from state "${getStateLabel(currentState)}". ` +
                    `Complete watering and fertilizing first.`
                );
            }
            
            return BatchService.recordHarvest(batchId, input, "harvest");
        }
    },
    
    Batch: {
        id: (parent) => parent._id.toString(),
        stateLabel: (parent) => {
            return getStateLabel(parent.currentState || "idle");
        }
    }
};

module.exports = batchResolver;
