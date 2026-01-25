<<<<<<< Updated upstream
const userSchema = require("./userSchema");
const farmSchema = require("./farmSchema");
const batchSchema = require("./batchSchema");
const businessSchema = require("./businessSchema");
const productSchema = require("./productSchema");
const orderSchema = require("./orderSchema");
const auctionSchema = require("./auctionSchema");
const reviewSchema = require("./reviewSchema");

const typeDefs = [
  userSchema,
  farmSchema,
  batchSchema,
  businessSchema,
  productSchema,
  orderSchema,
  auctionSchema,
  reviewSchema,
=======
const userSchema = require('./userSchema');
const farmSchema = require('./farmSchema');
const batchSchema = require('./batchSchema');
const profileSchema = require('./profileSchema');
const geocodingSchema = require('./geocodingSchema');

const typeDefs = [
    userSchema,
    farmSchema,
    batchSchema,
    profileSchema,
    geocodingSchema
>>>>>>> Stashed changes
];

module.exports = typeDefs;
