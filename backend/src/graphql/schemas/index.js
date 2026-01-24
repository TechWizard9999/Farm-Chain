const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');

const typeDefs = [
    userSchema,
    farmSchema
];

module.exports = typeDefs;
