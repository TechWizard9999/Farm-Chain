const userResolvers = require('./userResolver');
const farmResolver = require('./farmResolver');

const resolvers = {
    Query: {
        ...userResolvers.Query, ...farmResolver.Query
    },
    Mutation: {
        ...userResolvers.Mutation, ...farmResolver.Mutation
    },
    User: userResolvers.User,
};

module.exports = resolvers;
