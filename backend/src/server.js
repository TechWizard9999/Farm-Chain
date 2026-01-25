const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('../config/database');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const authController = require('./controllers/authController');
const businessController = require('./controllers/businessController');

const PORT = process.env.PORT || 4000;

const startServer = async () => {
    try {
        await connectDB();

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            csrfPrevention: false,
            introspection: true,
            formatError: (error) => {
                console.error('GraphQL Error:', error);
                return error;
            },
        });

        const { url } = await startStandaloneServer(server, {
            listen: { port: PORT },
            context: async ({ req }) => {
                const token = req.headers.authorization;
                const user = await authController.getUserFromToken(token);
                const business = await businessController.getBusinessFromToken(token);
                return { user, business };
            },
        });

        console.log(`Server ready at ${url}`);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

module.exports = { startServer };

