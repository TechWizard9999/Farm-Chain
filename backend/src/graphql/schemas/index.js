const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');
const batchSchema = require('./batchSchema');

const typeDefs = [
    userSchema,
    farmSchema,
    batchSchema
];

module.exports = typeDefs;
