const farmService = require("../../services/farmService");
const Farm = require("../../models/farm");

const farmResolver = {
    Query: {
        farm: async (_, { id }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return farmService.findById(id);
        },
        farms: async (_, { }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return farmService.findAll();
        }
    },
    Mutation: {
        createFarm: async (_, { location, size, pinCode, soilType, organicStatus, photo }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return farmService.create({ location, size, pinCode, soilType, organicStatus, photo });
        },
        updateFarm: async (_, args, context) => {
            if (!context.user) throw new Error("Unauthorized");
            const { id, ...rest } = args;
            const updateData = Object.fromEntries(
                Object.entries(rest).filter(([_, v]) => v !== undefined)
            );

            return farmService.update(id, updateData);
        },
        deleteFarm: async (_, { id }, context) => {
            if (!context.user) throw new Error("Unauthorized");
            return farmService.delete(id);
        }
    }
};

module.exports = farmResolver;
