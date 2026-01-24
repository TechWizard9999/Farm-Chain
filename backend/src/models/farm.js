const mongoose = require("mongoose");

const farmSchema = new mongoose.Schema({
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    size: { type: Number, required: true },
    pinCode: { type: String, required: true },
    soilType: { type: String, required: true },
    organicStatus: { type: String, required: true },
    photo: { type: String, required: true }
});

module.exports = mongoose.model("Farm", farmSchema);
