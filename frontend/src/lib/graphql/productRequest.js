export const CREATE_PRODUCT_REQUEST_MUTATION = `
  mutation CreateProductRequest($input: CreateProductRequestInput!) {
    createProductRequest(input: $input) {
      id
      productName
      quantity
      budgetPerKg
      status
    }
  }
`;

export const MY_PRODUCT_REQUESTS_QUERY = `
  query GetMyProductRequests {
    getMyProductRequests {
      id
      productName
      quantity
      budgetPerKg
      description
      status
      acceptedOffer {
        farmer {
          id
          name
        }
        pricePerKg
        message
        acceptedAt
      }
      offers {
        id
        farmer {
          id
          name
        }
        pricePerKg
        message
        status
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const PRODUCT_REQUESTS_QUERY = `
  query GetProductRequests {
    getProductRequests {
      id
      consumer {
        id
        name
        email
      }
      productName
      quantity
      budgetPerKg
      description
      status
      offers {
        id
        farmer {
          id
          name
        }
        pricePerKg
        message
        status
        createdAt
      }
      createdAt
    }
  }
`;

export const MY_OFFERS_QUERY = `
  query GetMyOffers {
    getMyOffers {
      id
      consumer {
        id
        name
      }
      productName
      quantity
      budgetPerKg
      description
      status
      acceptedOffer {
        farmer {
          id
          name
        }
        pricePerKg
        acceptedAt
      }
      offers {
        id
        farmer {
          id
          name
        }
        pricePerKg
        message
        status
        createdAt
      }
      createdAt
    }
  }
`;

export const OFFER_ON_REQUEST_MUTATION = `
  mutation OfferOnProductRequest($input: CreateRequestOfferInput!) {
    offerOnProductRequest(input: $input) {
      id
      status
      offers {
        id
        pricePerKg
        message
        status
      }
    }
  }
`;

export const ACCEPT_OFFER_MUTATION = `
  mutation AcceptOffer($requestId: ID!, $offerIndex: Int!) {
    acceptOffer(requestId: $requestId, offerIndex: $offerIndex) {
      id
      status
      acceptedOffer {
        farmer {
          id
          name
        }
        pricePerKg
        acceptedAt
      }
    }
  }
`;

export const REJECT_OFFER_MUTATION = `
  mutation RejectOffer($requestId: ID!, $offerIndex: Int!) {
    rejectOffer(requestId: $requestId, offerIndex: $offerIndex) {
      id
      offers {
        id
        status
      }
    }
  }
`;

export const CANCEL_REQUEST_MUTATION = `
  mutation CancelProductRequest($id: ID!) {
    cancelProductRequest(id: $id) {
      id
      status
    }
  }
`;
