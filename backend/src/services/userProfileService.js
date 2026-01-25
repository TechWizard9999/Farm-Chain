const UserProfile = require("../models/userProfile");

class UserProfileService {
    async findByUserId(userId) {
        return UserProfile.findOne({ user: userId }).populate("user");
    }

    async create(profileData) {
        const profile = new UserProfile(profileData);
        return await profile.save();
    }

    async updateProfile(userId, profileData) {
        return UserProfile.findOneAndUpdate(
            { user: userId },
            { $set: profileData },
            { new: true, runValidators: true, upsert: true }
        ).populate("user");
    }

    async updateBankDetails(userId, bankDetails) {
        return UserProfile.findOneAndUpdate(
            { user: userId },
            { $set: { bankDetails } },
            { new: true, runValidators: true }
        ).populate("user");
    }

    async updateNotificationSettings(userId, notificationSettings) {
        return UserProfile.findOneAndUpdate(
            { user: userId },
            { $set: { notificationSettings } },
            { new: true, runValidators: true }
        ).populate("user");
    }

    async delete(userId) {
        return UserProfile.findOneAndDelete({ user: userId });
    }
}

module.exports = new UserProfileService();
