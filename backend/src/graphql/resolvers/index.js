const userResolvers = require('./userResolver');
const farmResolver = require('./farmResolver');
const batchResolver = require('./batchResolver');

const resolvers = {
    Query: {
        ...userResolvers.Query, ...farmResolver.Query, ...batchResolver.Query
    },
    Mutation: {
        ...userResolvers.Mutation, ...farmResolver.Mutation, ...batchResolver.Mutation
    },
    User: userResolvers.User,
};

module.exports = resolvers;
