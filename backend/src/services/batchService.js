const Batch = require("../models/batch");

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

        return Batch.findByIdAndUpdate(
            batchId,
            { $push: { activities: activityData } },
            { new: true, runValidators: true }
        ).populate("farm");
    }

    async recordHarvest(batchId, harvestData) {
        if (!harvestData.harvestDate) {
            harvestData.harvestDate = new Date();
        }

        return Batch.findByIdAndUpdate(
            batchId,
            { $push: { harvests: harvestData } },
            { new: true, runValidators: true }
        ).populate("farm");
    }

    async delete(id) {
        return Batch.findByIdAndDelete(id);
    }
}

module.exports = new BatchService();
