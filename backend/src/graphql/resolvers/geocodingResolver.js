const GeocodingService = require("../../services/geocodingService");

const geocodingResolver = {
    Query: {
        geocodeAddress: async (_, { address }, context) => {
            return GeocodingService.geocodeAddress(address);
        },
        reverseGeocode: async (_, { latitude, longitude }, context) => {
            return GeocodingService.reverseGeocode(latitude, longitude);
        }
    }
};

module.exports = geocodingResolver;
