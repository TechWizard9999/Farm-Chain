const mongoose = require("mongoose");

const bankDetailsSchema = new mongoose.Schema({
    upiId: { type: String },
    bankAccountNumber: { type: String },
    ifscCode: { type: String },
    accountHolderName: { type: String }
}, { _id: false });

const notificationSettingsSchema = new mongoose.Schema({
    orderAlerts: { type: Boolean, default: true },
    paymentAlerts: { type: Boolean, default: true },
    bidUpdates: { type: Boolean, default: true },
    weatherAlerts: { type: Boolean, default: true }
}, { _id: false });

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    profilePhoto: { type: String },
    languagePreference: {
        type: String,
        enum: ["ENGLISH", "HINDI", "KANNADA", "TELUGU", "TAMIL"],
        default: "ENGLISH"
    },
    bankDetails: bankDetailsSchema,
    notificationSettings: {
        type: notificationSettingsSchema,
        default: () => ({})
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
