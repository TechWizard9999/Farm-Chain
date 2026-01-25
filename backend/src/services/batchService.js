const Batch = require("../models/batch");
const { canDoActivity, getNextState } = require("../stateMachines/journeyStateMachine");

class BatchService {
    async findById(id) {
        return Batch.findById(id).populate("farm");
    }

    async findByFarm(farmId) {
        return Batch.find({ farm: farmId }).populate("farm");
    }

    async create(batchData) {
        if (batchData.activities && batchData.activities.length > 0) {
            batchData.activities = batchData.activities.map(activity => ({
                ...activity,
                date: activity.date || new Date()
            }));
        }

        if (batchData.harvests && batchData.harvests.length > 0) {
            batchData.harvests = batchData.harvests.map(harvest => ({
                ...harvest,
                harvestDate: harvest.harvestDate || new Date()
            }));
        }

        const batch = new Batch(batchData);
        return await batch.save();
    }

    async update(id, batchData) {
        if (batchData.activities && batchData.activities.length > 0) {
            batchData.activities = batchData.activities.map(activity => ({
                ...activity,
                date: activity.date || new Date()
            }));

            const currentBatch = await Batch.findById(id);
            if (!currentBatch) {
                throw new Error("Batch not found");
            }

            const currentState = currentBatch.activities.length > 0
                ? currentBatch.activities[currentBatch.activities.length - 1].activityType.toLowerCase()
                : "idle";

            const newActivityType = batchData.activities[0].activityType;

            const isValid = canDoActivity(currentState, newActivityType);
            if (!isValid) {
                throw new Error(`Invalid activity sequence: Cannot perform ${newActivityType} from state ${currentState}`);
            }
        }

        if (batchData.harvests && batchData.harvests.length > 0) {
            batchData.harvests = batchData.harvests.map(harvest => ({
                ...harvest,
                harvestDate: harvest.harvestDate || new Date()
            }));
        }

        return Batch.findByIdAndUpdate(
            id,
            { $set: batchData },
            { new: true, runValidators: true }
        ).populate("farm");
    }

    async addActivity(batchId, activityData) {
        if (!activityData.date) {
            activityData.date = new Date();
        }

        const currentBatch = await Batch.findById(batchId);
        if (!currentBatch) {
            throw new Error("Batch not found");
        }

        const currentState = currentBatch.activities.length > 0
            ? currentBatch.activities[currentBatch.activities.length - 1].activityType.toLowerCase()
            : "idle";

        const newActivityType = activityData.activityType;

        const isValid = canDoActivity(currentState, newActivityType);
        if (!isValid) {
            throw new Error(`Invalid activity sequence: Cannot perform ${newActivityType} from state ${currentState}`);
        }

        return Batch.findByIdAndUpdate(
            batchId,
            { $push: { activities: activityData } },
            { new: true, runValidators: true }
        ).populate("farm");
    }

    async logActivity(batchId, activityData, nextState) {
        if (!activityData.date) {
            activityData.date = new Date();
        }

        return Batch.findByIdAndUpdate(
            batchId,
            { 
                $push: { activities: activityData },
                $set: { currentState: nextState }
            },
            { new: true, runValidators: true }
        ).populate("farm");
    }

    async recordHarvest(batchId, harvestData, nextState = "harvest") {
        if (!harvestData.harvestDate) {
            harvestData.harvestDate = new Date();
        }

        return Batch.findByIdAndUpdate(
            batchId,
            { 
                $push: { harvests: harvestData },
                $set: { currentState: nextState }
            },
            { new: true, runValidators: true }
        ).populate("farm");
    }

    async delete(id) {
        return Batch.findByIdAndDelete(id);
    }

    async updateActivityBlockchain(batchId, activityIndex, txHash, blockNumber) {
        const updatePath = `activities.${activityIndex}`;
        return Batch.findByIdAndUpdate(
            batchId,
            {
                $set: {
                    [`${updatePath}.blockchainTxHash`]: txHash,
                    [`${updatePath}.blockchainBlock`]: blockNumber,
                    [`${updatePath}.blockchainStatus`]: 'confirmed'
                }
            },
            { new: true }
        );
    }
}

module.exports = new BatchService();
