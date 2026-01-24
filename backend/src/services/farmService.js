const Farm = require("../models/farm");

class FarmService {
    async findById(id) {
        return Farm.findById(id);
    }

    async findAll() {
        return Farm.find();
    }

    async create(farmData) {
        const farm = new Farm(farmData);
        return await farm.save();
    }

    async update(id, farmData) {
        return Farm.findByIdAndUpdate(
            id,
            { $set: farmData },
            { new: true, runValidators: true }
        );
    }

    async delete(id) {
        return Farm.findByIdAndDelete(id);
    }
}

module.exports = new FarmService();