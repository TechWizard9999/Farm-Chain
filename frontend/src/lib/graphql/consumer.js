export const TRACE_PRODUCT = `
  query TraceProduct($qrCode: String!) {
    traceProduct(qrCode: $qrCode) {
      product {
        id
        title
        description
        category
        pricePerKg
        availableQty
        isOrganic
        qrCode
        qrImage
        status
        createdAt
      }
      farmer {
        name
        verified
      }
      farm {
        latitude
        longitude
        size
        soilType
        organicStatus
      }
      batch {
        cropName
        variety
        seedSource
        sowingDate
        harvestDate
        qualityGrade
      }
      timeline {
        type
        date
        title
        description
        whoClass
        icon
      }
      scores {
        freshness
        organic
        overall
      }
      isVerified
    }
  }
`;

export const LIST_PRODUCTS = `
  query ListProducts($filters: ProductFilters) {
    listProducts(filters: $filters) {
      id
      title
      description
      category
      pricePerKg
      availableQty
      isOrganic
      qrCode
      qrImage
      status
      createdAt
      farmer {
        id
        name
      }
    }
  }
`;

export const GET_PRODUCT = `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      title
      description
      category
      pricePerKg
      availableQty
      isOrganic
      qrCode
      qrImage
      status
      createdAt
      farmer {
        id
        name
      }
      batch {
        id
        cropName
        variety
        seedSource
        sowingDate
        currentState
      }
    }
  }
`;

export const GET_FARMER_RATING_STATS = `
  query GetFarmerRatingStats($farmerId: ID!) {
    getFarmerRatingStats(farmerId: $farmerId) {
      averageRating
      averageQuality
      averageDelivery
      averageCommunication
      totalReviews
      ratingDistribution {
        one
        two
        three
        four
        five
      }
    }
  }
`;

export const GET_FARMER_REVIEWS = `
  query GetFarmerReviews($farmerId: ID!, $limit: Int) {
    getFarmerReviews(farmerId: $farmerId, limit: $limit) {
      id
      rating
      qualityRating
      deliveryRating
      communicationRating
      comment
      createdAt
      reviewer {
        companyName
      }
    }
  }
`;
