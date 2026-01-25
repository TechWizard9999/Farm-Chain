const farmService = require("../../services/farmService");

const farmResolver = {
  Query: {
    farm: async (_, { id }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return farmService.findById(id);
    },
    farms: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return farmService.findAll();
    },
    myFarms: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return farmService.findByFarmer(context.user._id);
    },
  },
  Mutation: {
    createFarm: async (_, args, context) => {
      console.log("createFarm mutation called", args);
      if (!context.user) throw new Error("Unauthorized");
      try {
        return await farmService.create({ ...args, farmer: context.user._id });
      } catch (error) {
        console.error("createFarm error:", error);
        throw error;
      }
    },
    updateFarm: async (_, args, context) => {
      if (!context.user) throw new Error("Unauthorized");
      const { id, ...rest } = args;
      const updateData = Object.fromEntries(
        Object.entries(rest).filter(([_, v]) => v !== undefined),
      );

      return farmService.update(id, updateData);
    },
    deleteFarm: async (_, { id }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      return farmService.delete(id);
    },
  },
  Farm: {
    id: (parent) => parent._id.toString(),
  },
};

module.exports = farmResolver;
