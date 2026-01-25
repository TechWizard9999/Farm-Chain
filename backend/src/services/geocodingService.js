const NodeGeocoder = require('node-geocoder');


const options = {
    provider: 'openstreetmap',
    formatter: null
};

const geocoder = NodeGeocoder(options);

class GeocodingService {

    async geocodeAddress(address) {
        try {
            const results = await geocoder.geocode(address);

            if (!results || results.length === 0) {
                throw new Error('Address not found');
            }

            const location = results[0];

            return {
                latitude: location.latitude,
                longitude: location.longitude,
                formattedAddress: location.formattedAddress,
                country: location.country,
                city: location.city,
                state: location.state,
                zipcode: location.zipcode,
                streetName: location.streetName,
                streetNumber: location.streetNumber,
                countryCode: location.countryCode
            };
        } catch (error) {
            throw new Error(`Geocoding failed: ${error.message}`);
        }
    }


    async reverseGeocode(latitude, longitude) {
        try {
            const results = await geocoder.reverse({ lat: latitude, lon: longitude });

            if (!results || results.length === 0) {
                throw new Error('Location not found');
            }

            const location = results[0];

            return {
                latitude: location.latitude,
                longitude: location.longitude,
                formattedAddress: location.formattedAddress,
                country: location.country,
                city: location.city,
                state: location.state,
                zipcode: location.zipcode,
                streetName: location.streetName,
                streetNumber: location.streetNumber,
                countryCode: location.countryCode
            };
        } catch (error) {
            throw new Error(`Reverse geocoding failed: ${error.message}`);
        }
    }
}

module.exports = new GeocodingService();
