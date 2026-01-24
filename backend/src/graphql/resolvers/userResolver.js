const authController = require("../../controllers/authController");
const userService = require("../../services/userService");

const userResolvers = {
    Query: {
        user: async (_, { identifier }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return userService.findByIdentifier(identifier);
        },
    },

    Mutation: {
        signup: async (_, { name, email, phone, password }) => {
            return authController.signup(name, email, phone, password);
        },

        login: async (_, { identifier, password }) => {
            return authController.login(identifier, password);
        },

        sendOTP: async (_, { identifier }) => {
            return authController.sendOTP(identifier);
        },

        verifyOTP: async (_, { identifier, otp }) => {
            return authController.verifyOTP(identifier, otp);
        },

        resetPassword: async (_, { identifier, otp, newPassword }) => {
            return authController.resetPassword(identifier, otp, newPassword);
        },

        updateProfile: async (_, { email, phone }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return authController.updateProfile(context.user._id.toString(), email, phone);
        },
    },

    User: {
        id: (parent) => parent._id.toString(),
    },
};

module.exports = userResolvers;
