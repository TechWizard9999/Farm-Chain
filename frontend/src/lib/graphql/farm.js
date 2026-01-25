export const CREATE_FARM_MUTATION = `
  mutation CreateFarm(
    $location: CoordinatesInput!
    $size: Float!
    $pinCode: String!
    $soilType: String!
    $organicStatus: String!
    $photo: String!
  ) {
    createFarm(
      location: $location
      size: $size
      pinCode: $pinCode
      soilType: $soilType
      organicStatus: $organicStatus
      photo: $photo
    ) {
      id
      location {
        latitude
        longitude
      }
      size
      pinCode
      soilType
      organicStatus
      photo
    }
  }
`;

export const MY_FARMS_QUERY = `
  query MyFarms {
    myFarms {
      id
      location {
        latitude
        longitude
      }
      size
      pinCode
      soilType
      organicStatus
      photo
    }
  }
`;

export const GET_FARM_QUERY = `
  query GetFarm($id: ID!) {
    farm(id: $id) {
      id
      location {
        latitude
        longitude
      }
      size
      pinCode
      soilType
      organicStatus
      photo
    }
  }
`;

export const UPDATE_FARM_MUTATION = `
  mutation UpdateFarm(
    $id: ID!
    $location: CoordinatesInput
    $size: Float
    $pinCode: String
    $soilType: String
    $organicStatus: String
    $photo: String
  ) {
    updateFarm(
      id: $id
      location: $location
      size: $size
      pinCode: $pinCode
      soilType: $soilType
      organicStatus: $organicStatus
      photo: $photo
    ) {
      id
      location {
        latitude
        longitude
      }
      size
      pinCode
      soilType
      organicStatus
      photo
    }
  }
`;

export const DELETE_FARM_MUTATION = `
  mutation DeleteFarm($id: ID!) {
    deleteFarm(id: $id) {
      id
    }
  }
`;
