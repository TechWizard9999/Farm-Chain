const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const connectDB = require('../config/database');
const typeDefs = require('./graphql/schemas');
const resolvers = require('./graphql/resolvers');
const authController = require('./controllers/authController');

const PORT = process.env.PORT || 4000;

const createServer = () => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: false,
        introspection: true,
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            return error;
        },
    });
};

const startServer = async () => {
    try {
        await connectDB();

        const server = createServer();

        const { url } = await startStandaloneServer(server, {
            listen: { port: PORT },
            context: async ({ req }) => {
                const token = req.headers.authorization;
                const user = await authController.getUserFromToken(token);
                return { user };
            },
        });

        console.log(`Server ready at ${url}`);
        console.log(`GraphQL endpoint: ${url}graphql`);
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
};

module.exports = { createServer, startServer };
