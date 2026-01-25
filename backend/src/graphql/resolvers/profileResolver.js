const UserProfileService = require("../../services/userProfileService");

const profileResolver = {
    Query: {
        getMyProfile: async (_, __, context) => {

            const userId = context.userId || context.user?.id;
            if (!userId) {
                throw new Error("Authentication required");
            }
            return UserProfileService.findByUserId(userId);
        },
        getUserProfile: async (_, { userId }, context) => {
            return UserProfileService.findByUserId(userId);
        }
    },
    Mutation: {
        createUserProfile: async (_, { input }, context) => {
            return UserProfileService.create(input);
        },
        updateUserProfile: async (_, { input }, context) => {
            const userId = context.userId || context.user?.id;
            if (!userId) {
                throw new Error("Authentication required");
            }
            return UserProfileService.updateProfile(userId, input);
        },
        updateUserBankDetails: async (_, { input }, context) => {
            const userId = context.userId || context.user?.id;
            if (!userId) {
                throw new Error("Authentication required");
            }
            return UserProfileService.updateBankDetails(userId, input);
        },
        updateUserNotificationSettings: async (_, { input }, context) => {
            const userId = context.userId || context.user?.id;
            if (!userId) {
                throw new Error("Authentication required");
            }
            return UserProfileService.updateNotificationSettings(userId, input);
        },
        deleteUserProfile: async (_, { userId }, context) => {
            return UserProfileService.delete(userId);
        },
        logout: async (_, __, context) => {

            return true;
        }
    }
};

module.exports = profileResolver;
