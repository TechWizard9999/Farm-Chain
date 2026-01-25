const typeDefs = `#graphql

type Coordinates {
  latitude: Float!
  longitude: Float!
  formattedAddress: String
  country: String
  city: String
  state: String
  zipcode: String
  streetName: String
  streetNumber: String
  countryCode: String
}

type Query {
  geocodeAddress(address: String!): Coordinates
  reverseGeocode(latitude: Float!, longitude: Float!): Coordinates
}

`

module.exports = typeDefs;
